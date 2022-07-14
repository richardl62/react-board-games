import { Ctx } from "boardgame.io";
import { sAssert } from "../../../utils/assert";
import { GameOptions, Letter, letterDistrubtion } from "../config";

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

function selectLettersUnchecked(ctx: Ctx, opts: GameOptions) : Letter[] {
    const random = ctx.random;
    sAssert(random);
    return random.Shuffle([...letterSet]).slice(0, opts.rackSize);
}

function selectionOK(letters: Letter[], opts: GameOptions) {
    let nVowels = 0;
    let nConsonants = 0;
    for(const letter of letters) {
        if(vowels.includes(letter)) {
            ++nVowels;
        } else {
            ++nConsonants;
        }
    }

    return nVowels >= opts.minVowels && nConsonants >= opts.minConsonants;
}

export function selectLetters(ctx: Ctx, opts: GameOptions) : Letter[] {
    let selected = selectLettersUnchecked(ctx, opts);
    while(!selectionOK(selected, opts)) {
        selected = selectLettersUnchecked(ctx, opts);
    }
    
    return selected;
}