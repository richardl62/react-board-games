interface DictionaryEntry {
    meanings?: {
        definitions?: {
            definition?: string;
        }[];
    }[];
}

// Look up a definition using the free dictionary API. 
// Returns a promise that 
// - Resolves to the first definition string if the word is found
// - Resolves to null if the word is not found.
// - Fails if there is a problem with the lookup. 
export function fetchDefinition(wordToCheck: string): Promise<string | null> {
    return fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(wordToCheck)}`)
        .then(response => response.json())
        .then((data: unknown) => {
            if(!Array.isArray(data)) {
                // No definition was found.
                return null;
            }
            const entries = data as DictionaryEntry[];
            const def = entries[0]?.meanings?.[0]?.definitions?.[0]?.definition;
            if (typeof def === "string") {
                return def;
            }
            console.warn("Unexpected response format from dictionary API:", data);
            throw new Error("Unexpected response format from dictionary API.");
        });
}