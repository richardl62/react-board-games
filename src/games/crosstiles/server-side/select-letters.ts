import { shuffle } from "../../../utils/shuffle";
import { Letter, letterDistrubtion, tilesPerTurn } from "../config";

// Here "Y" counts as a vowel.
const vowels = ["A","E","I","O","U","Y"];

const letterSet = (() => {
    const letterSet: Array<Letter> = [];

    let letter: Letter;
    for (letter in letterDistrubtion) {
        const count = letterDistrubtion[letter];
        for (let i = 0; i < count; ++i) {
            letterSet.push(letter);
        }
    }

    return letterSet;
})();
Object.freeze(letterSet);

function selectLettersUnchecked() : Letter[] {
    return shuffle([...letterSet]).slice(0, tilesPerTurn.number);
}

function selectionOK(letters: Letter[]) {
    let nVowels = 0;
    let nConsonants = 0;
    for(const letter of letters) {
        if(vowels.includes(letter)) {
            ++nVowels;
        } else {
            ++nConsonants;
        }
    }

    return nVowels >= tilesPerTurn.minVowels && nConsonants >= tilesPerTurn.minConsonants;
}

export function selectLetters() : Letter[] {
    let selected = selectLettersUnchecked();
    while(!selectionOK(selected)) {
        selected = selectLettersUnchecked();
    }
    
    return selected;
}