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
    // The words (lower case) that this entry is a definition of, e.g. an entry
    // for the headword "run" has stems including "run", "runs", "ran", "running".
    stems?: string[];
  };
  shortdef?: string[];
  // Present on cross-reference entries, e.g. British spellings such as
  // "colour" have no shortdef of their own, only a cxs entry pointing to the
  // main ("color") headword: { cxl: "chiefly British spelling of", cxtis: [{ cxt: "color" }] }.
  cxs?: {
    cxl?: string;
    cxtis?: { cxt?: string }[];
  }[];
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
    return { definition: def };
  }

  // Some entries (e.g. British spellings like "colour") have no shortdef of
  // their own, only a cross-reference to the main headword.
  const crossRef = match.cxs?.[0];
  const crossRefTarget = crossRef?.cxtis?.[0]?.cxt;
  if (crossRef?.cxl && crossRefTarget) {
    return { definition: `${crossRef.cxl} ${crossRefTarget}` };
  }

  console.warn('Unexpected response format from dictionary API:', data);
  throw new Error('Unexpected response format from dictionary API.');
}
