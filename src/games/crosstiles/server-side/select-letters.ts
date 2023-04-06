import { Ctx } from "boardgame.io";
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

function selectLettersUnchecked(_ctx: Ctx, _opts: GameOptions) : Letter[] {
    // const random = ctx.random;
    // sAssert(random);
    // return random.Shuffle([...letterSet]).slice(0, opts.rackSize);
    return [];
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

export function selectLetters(ctx: Ctx, opts: GameOptions) : Letter[] {
    let selected = selectLettersUnchecked(ctx, opts);
    while(!selectionOK(selected, opts)) {
        selected = selectLettersUnchecked(ctx, opts);
    }
    
    return selected;
}