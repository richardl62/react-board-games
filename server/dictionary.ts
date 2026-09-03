import { DictionaryLookupResult } from '../shared/dictionary/types.js';

const dictionaryApiKey = process.env.DICTIONARY_API_KEY;
if (!dictionaryApiKey) {
  // See .env.example for details of how to set a key.
  console.warn(
    'DICTIONARY_API_KEY environment variable is not set. ',
    'Lookups using the Merriam-Webster dictionary will fail.',
  );
}

// See https://dictionaryapi.com/products/json#sec-2 for the full response format.
interface CollegiateEntry {
  meta?: {
    // The headword this entry defines, e.g. "happy". Suffixed with ":1", ":2"
    // etc. when the dictionary has multiple homograph entries for the same
    // spelling (e.g. "bank:1", "bank:2").
    id?: string;
    // The words (lower case) that this entry is a definition of, e.g. an entry
    // for the headword "run" has stems including "run", "runs", "ran", "running".
    stems?: string[];
  };
  shortdef?: string[];
  // Present on cross-reference entries, which have no shortdef of their own,
  // only a pointer to another headword, e.g. British spellings such as
  // "colour" -> { cxl: "chiefly British spelling of", cxtis: [{ cxt: "color" }] },
  // or plurals such as "mice" -> { cxl: "plural of", cxtis: [{ cxt: "mouse" }] }.
  cxs?: {
    cxl?: string;
    cxtis?: { cxt?: string }[];
  }[];
}

interface RawLookupResult {
  definition: string | null;
  // See DictionaryLookupResult.baseWord.
  baseWord?: string;
  // Set instead of a definition when the matched entry is a pure
  // cross-reference (e.g. "colour" -> "color", "mice" -> "mouse").
  crossReferenceTarget?: string;
}

// A single Merriam-Webster API call: fetch, and match an entry to `word`.
// Does not follow cross-references - see lookupDefinition for that.
async function lookupOnce(word: string): Promise<RawLookupResult> {
  const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(word)}?key=${dictionaryApiKey}`;
  const response = await fetch(url);
  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    console.warn('Unexpected response format from dictionary API:', data);
    throw new Error('Unexpected response format from dictionary API.');
  }
  if (data.length === 0 || typeof data[0] === 'string') {
    // An empty array means no match at all. An array of strings means no
    // exact match, and these are spelling suggestions instead of entries.
    return { definition: null };
  }

  const entries = data as CollegiateEntry[];
  const lowerWord = word.toLowerCase();
  const match = entries.find((entry) => entry.meta?.stems?.includes(lowerWord));
  if (!match) {
    // None of the returned entries are actually for the requested word,
    // e.g. they may only be for a related headword.
    return { definition: null };
  }

  const def = match.shortdef?.[0];
  if (typeof def === 'string') {
    // meta.id is the entry's own headword (e.g. "happy"), stripped of any
    // ":1", ":2" homograph suffix. When it differs from the looked-up word,
    // the definition is actually for a different, base word (e.g. looking up
    // "happiest" returns the definition for "happy").
    const headword = match.meta?.id?.replace(/:\d+$/, '');
    const baseWord = headword && headword.toLowerCase() !== lowerWord ? headword : undefined;
    return { definition: def, baseWord };
  }

  const crossReferenceTarget = match.cxs?.[0]?.cxtis?.[0]?.cxt;
  if (crossReferenceTarget) {
    return { definition: null, crossReferenceTarget };
  }

  console.warn('Unexpected response format from dictionary API:', data);
  throw new Error('Unexpected response format from dictionary API.');
}

// Look up a definition using the Merriam-Webster Collegiate Dictionary API.
// https://dictionaryapi.com/products/api-collegiate-dictionary
// Returns a promise that
// - Resolves to the first definition string if the word is found
// - Resolves with a null definition if the word is not found.
// - Fails if there is a problem with the lookup.
export async function lookupDefinition(word: string): Promise<DictionaryLookupResult> {
  if (!dictionaryApiKey) {
    return { definition: 'Cannot look up word: Dictionary key missing' };
  }

  const result = await lookupOnce(word);
  if (!result.crossReferenceTarget) {
    return { definition: result.definition, baseWord: result.baseWord };
  }

  // A pure cross-reference (e.g. "colour" -> "color", "mice" -> "mouse") has
  // no definition of its own - follow it once to get the target's definition.
  const target = await lookupOnce(result.crossReferenceTarget);
  if (target.definition === null) {
    return { definition: null };
  }
  return { definition: target.definition, baseWord: result.crossReferenceTarget };
}
