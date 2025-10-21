import { sAssert } from "../../../utils/assert.js";
import { Letter, standardLetterSet} from "./letters.js";
import { SquareType } from "./square-type.js";
import { RandomAPI } from "../../../random-api.js";
import { getScrabbleWords } from "../../../utils/get-scrabble-words.js";

const D = SquareType.doubleWord;
const T = SquareType.tripleWord;
const d = SquareType.doubleLetter;
const t = SquareType.tripleLetter;
const s = SquareType.simple;

/** Info needed to score a word */
export interface ScoringConfig {
    boardLayout: SquareType[][];
    rackSize: number;
    allLetterBonus: number,
}

export interface ScrabbleConfig extends ScoringConfig {
    name: string,

    minPlayers: number,
    maxPlayers: number, 
    
    getLegalWords: () => Promise<string[]>;

    /** Make a full bag of letters suitable for use at the start
     * of a game. The returned bag is shuffled if appropriate.
     * (In general the letters should be shuffled. But for some test purposes,
     * an unshuffled bag may be perfered.)
     * The bag in always shuffled after an exchange of tile (even when
     * this would be unhelpful for testing.)  Aug 2021
     */
    makeFullBag : (random: RandomAPI) => Letter[];
}

export const standard : ScrabbleConfig = {
    name: "scrabble",

    minPlayers: 1,
    maxPlayers: 4, 

    getLegalWords: getScrabbleWords,

    makeFullBag(
        random: RandomAPI
    ) : Letter[] {
        return random.Shuffle([...standardLetterSet]); 
    },

    boardLayout: [
        [T, s, s, d, s, s, s, T, s, s, s, d, s, s, T],
        [s, D, s, s, s, t, s, s, s, t, s, s, s, D, s],
        [s, s, D, s, s, s, d, s, d, s, s, s, D, s, s],
        [d, s, s, D, s, s, s, d, s, s, s, D, s, s, d],
        [s, s, s, s, D, s, s, s, s, s, D, s, s, s, s],
        [s, t, s, s, s, t, s, s, s, t, s, s, s, t, s],
        [s, s, d, s, s, s, d, s, d, s, s, s, d, s, s],
        [T, s, s, d, s, s, s, D, s, s, s, d, s, s, T],
        [s, s, d, s, s, s, d, s, d, s, s, s, d, s, s],
        [s, t, s, s, s, t, s, s, s, t, s, s, s, t, s],
        [s, s, s, s, D, s, s, s, s, s, D, s, s, s, s],
        [d, s, s, D, s, s, s, d, s, s, s, D, s, s, d],
        [s, s, D, s, s, s, d, s, d, s, s, s, D, s, s],
        [s, D, s, s, s, t, s, s, s, t, s, s, s, D, s],
        [T, s, s, d, s, s, s, T, s, s, s, d, s, s, T],
    ],

    rackSize: 7,

    allLetterBonus: 50,
};
Object.freeze(standard);


sAssert(standard.boardLayout.length === 15);
standard.boardLayout.forEach(row => sAssert(row.length === 15));


const simpleScrabbleWords = [
    "aa",
    "ab",
    "bc",
    "abc",
    "abcd",
];

const simpleScrabbleLettersForBag : Letter []= [
    "?","?","A","B",
    "?","?","C","D",
    "A","B","C","D",
];

export const simple: ScrabbleConfig = {
    name: "scrabble-simple",

    minPlayers: 1,
    maxPlayers: 4,
    rackSize: 4,

    getLegalWords: async () => simpleScrabbleWords,
    makeFullBag: () : Letter[] => [...simpleScrabbleLettersForBag].reverse(),

    boardLayout: [
        [t, s, s, s, t,],
        [s, d, s, d, s,],
        [s, s, D, s, s,],
        [s, d, s, d, s,],
        [t, s, s, s, t,],

    ],

    allLetterBonus: 20,
};
Object.freeze(simple);

const configs = [standard, simple];

/** Quick check that an object is a ScrabbleContext */
export function isScrabbleConfig(arg: unknown) : boolean {
    let valid = false;
    
    try {
        const inputConf = arg as ScrabbleConfig;
        for (const conf of configs) {
            if (inputConf.name === conf.name) {
                valid = true;
            }
        }
    // eslint-disable-next-line no-empty
    } catch { }

    return valid;
}



