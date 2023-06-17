const wordListURL = "https://raw.githubusercontent.com/richardl62/scrabble-words/main/legal-words.txt";

export async function getLegalWordList(): Promise<string[]> {
    const response = await fetch(wordListURL);
    if(!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    return (await response.text()).split("\n");
}

/**
 * @returns a promise of a function that checks if a word is legal in Scrabble
 */
export async function getWordChecker(): Promise<(word: string) => boolean> {
    const legalWords = await getLegalWordList();

    return (word: string) => {
        const revisedWord = word.trim().toLocaleLowerCase();

        return legalWords.includes(revisedWord);
    };
}
