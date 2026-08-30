import { serverAddress } from '@/app/server-address';
import { DictionaryLookupResult } from '@shared/dictionary/types';

// - 'merriam-webster': looked up via the server's /dictionary endpoint, which
//   proxies to the Merriam-Webster Collegiate Dictionary API, keeping its API
//   key server-side rather than exposing it to players.
// - 'dictionaryapi-dev': the free, keyless api.dictionaryapi.dev API, called
//   directly from the client. Kept available for a possible future fully
//   static (serverless) build, which would have no server to proxy through.
export type DictionarySource = 'merriam-webster' | 'dictionaryapi-dev';

// Look up a definition using the given dictionary source.
// Returns a promise that
// - Resolves to the first definition string if the word is found
// - Resolves to null if the word is not found.
// - Fails if there is a problem with the lookup.
export function fetchDefinition(
  wordToCheck: string,
  source: DictionarySource,
): Promise<string | null> {
  if (source === 'merriam-webster') {
    return fetchFromMerriamWebster(wordToCheck);
  }
  return fetchFromDictionaryApiDev(wordToCheck);
}

async function fetchFromMerriamWebster(wordToCheck: string): Promise<string | null> {
  const searchParams = new URLSearchParams({ word: wordToCheck });
  const response = await fetch(`${serverAddress()}/dictionary?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Dictionary lookup failed: fetch reported ${response.status}`);
  }

  const result = (await response.json()) as DictionaryLookupResult;
  return result.definition;
}

interface DictionaryApiDevEntry {
  meanings?: {
    definitions?: {
      definition?: string;
    }[];
  }[];
}

function fetchFromDictionaryApiDev(wordToCheck: string): Promise<string | null> {
  return fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(wordToCheck)}`,
  )
    .then((response) => response.json())
    .then((data: unknown) => {
      if (!Array.isArray(data)) {
        // No definition was found.
        return null;
      }
      const entries = data as DictionaryApiDevEntry[];
      const def = entries[0]?.meanings?.[0]?.definitions?.[0]?.definition;
      if (typeof def === 'string') {
        return def;
      }
      console.warn('Unexpected response format from dictionary API:', data);
      throw new Error('Unexpected response format from dictionary API.');
    });
}
