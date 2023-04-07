import { bonusLetters, Letter, letterDistrubtion } from "../config";
import { GameOptions } from "../options";

const vowels = ["A","E","I","O","U"];

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

function selectLettersUnchecked(
    opts: GameOptions,
    shuffle: (arr: Letter[]) => Letter[]
) : Letter[] {

    return shuffle([...letterSet]).slice(0, opts.rackSize);
}

function selectionOK(letters: Letter[], opts: GameOptions) {
    let nVowels = 0;
    let nConsonants = 0;
    let nBonusLetters = 0;
    for(const letter of letters) {
        if(vowels.includes(letter)) {
            ++nVowels;
        } else {
            ++nConsonants;
        }

        if(bonusLetters.includes(letter)) {
            nBonusLetters++;
        }
    }

    return nVowels >= opts.minVowels 
        && nConsonants >= opts.minConsonants
        && nBonusLetters >= opts.minBonusLetters
    ;
}

export function selectLetters(
    opts: GameOptions,
    shuffle: (arr: Letter[]) => Letter[]
) : Letter[] {
    let selected = selectLettersUnchecked(opts, shuffle);
    while(!selectionOK(selected, opts)) {
        selected = selectLettersUnchecked(opts, shuffle);
    }
    
    return selected;
}