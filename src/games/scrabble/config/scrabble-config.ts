import { sAssert } from "../../../utils/assert";
import { AppGame, GameCategory } from "../../../app-game-support";
import { Letter, standardLetterSet} from "./letters";
import { SquareType } from "./square-type";
import { RandomAPI } from "boardgame.io/dist/types/src/plugins/random/random";

const D = SquareType.doubleWord;
const T = SquareType.tripleWord;
const d = SquareType.doubleLetter;
const t = SquareType.tripleLetter;
const s = SquareType.simple;

export interface ScrabbleConfig {
    name: string,
    displayName: string,
    category: AppGame["category"],
    minPlayers: number,
    maxPlayers: number, 
    
    /** Make a full bag of letters suitable for use at the start
     * of a game. The returned bag is shuffled if appropriate.
     * (In general the letters should be shuffled. But for some test purposes,
     * an unshuffled bag may be perfered.)
     * The bag in always shuffled after an exchange of tile (even when
     * this would be unhelpful for testing.)  Aug 2021
     */
    makeFullBag : (random: RandomAPI) => Letter[];
    boardLayout: SquareType[][];
    rackSize: number;

    allLetterBonus: number,
}

const standard : ScrabbleConfig = {
    name: "scrabble",
    displayName: "Scrabble",
    category: GameCategory.standard,
    minPlayers: 1,
    maxPlayers: 4, 

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


const simple: ScrabbleConfig = {
    name: "scrabble-simple",
    displayName: "Simple Scrabble",
    category: GameCategory.test,
    minPlayers: 1,
    maxPlayers: 4,
    rackSize: 4,

    makeFullBag: () : Letter[] => {
        // Unshuffled to help with testing
        const letters : Letter[] = ["W", "O", "R", "D", 
            "D",  "A", "T", "E"];
            
        return letters.reverse();
    },

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

export const configs = [standard, simple];

/** Quick check that an object is a ScrabbleContext */
export function isScrabbleConfig(arg: unknown) : boolean {
    let valid = false;
    
    try {
        const inputConf = arg as ScrabbleConfig;
        for (const conf of configs) {
            if (inputConf.displayName === conf.displayName) {
                valid = true;
            }
        }
    // eslint-disable-next-line no-empty
    } catch { }

    return valid;
}



