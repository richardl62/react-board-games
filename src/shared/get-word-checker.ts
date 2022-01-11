import { legalWordsRawString } from "./legal-word-raw-string";

const legalWords = legalWordsRawString.split("\n");

/**
 * @returns a promise of a function that checks if a word is legal in Scrabble
 */
export async function getWordChecker(): Promise<(word: string) => boolean> {
    return (word: string) => {
        const revisedWord = word.trim().toLocaleLowerCase();

        // KLUDGE: For reasons I don't understand legalWords.includes("")
        // Returns true
        return revisedWord !== "" && legalWords.includes(revisedWord);
    };
}

