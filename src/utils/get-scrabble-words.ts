const wordListURL = "https://raw.githubusercontent.com/richardl62/scrabble-words/main/legal-words.txt";

export async function getScrabbleWords(): Promise<string[]> {
    const response = await fetch(wordListURL);
    if(!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    return (await response.text()).split("\n");
}
