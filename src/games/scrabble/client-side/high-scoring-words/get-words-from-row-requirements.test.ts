import { givenLetter } from "../../../../utils/word-finder/letter-requirement";
import { LetterSet } from "../../../../utils/word-finder/letter-set";
import { Trie } from "../../../../utils/word-finder/trie";
import { getWordsFromRowRequirements } from "./get-words-from-row-requirements";

const g = givenLetter;
//const a = allowedLetters;

test("words from row requirements 1", () => {
    const trie = new Trie(["aa","ab","bb", "abc"]);
    const requirements = [null, g("a"), null];
    const letters = new LetterSet("",4); // plenty of wild cards
    
    const expected = [
        {start: 0, word: "aa"},
        {start: 1, word: "aa"},
        {start: 1, word: "ab"}
    ];

    const result = getWordsFromRowRequirements(letters, requirements, trie);
    //console.log("result:", ...result);

    expect(result).toEqual(expected);
});