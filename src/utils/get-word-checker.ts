const wordListURL = "https://raw.githubusercontent.com/richardl62/scrabble-words/main/legal-words.txt";

type WordChecker = (word: string) => boolean;

function makeWordChecker(wordList: string) : WordChecker {
    const legalWords = wordList.split("\n");
    
    return (word: string) => {
        const revisedWord = word.trim().toLocaleLowerCase();

        // KLUDGE: For reasons I don't understand legalWords.includes("")
        // Returns true
        return revisedWord !== "" && legalWords.includes(revisedWord);
    };
}

/**
 * @returns a promise of a function that checks if a word is legal in Scrabble
 */
export async function getWordChecker(): Promise<WordChecker> {
    const response = await fetch(wordListURL);
    if(!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    const text = await response.text();
    return makeWordChecker(text);
}

