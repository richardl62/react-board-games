import { sAssert } from "shared/assert";
import { shuffle } from "shared/tools";
import { CoreTile, makeCoreTile } from "./core-tile";
import { Letter, standardLetterSet} from "./letters";
import { SquareType } from "./square-type";

// KLUDGE: See comment on letterScores
export const allLetterBonus = 50;

const D = SquareType.doubleWord;
const T = SquareType.tripleWord;
const d = SquareType.doubleLetter;
const t = SquareType.tripleLetter;
const s = SquareType.simple;


export interface ScrabbleConfig {
    name: string,
    displayName: string,
    minPlayers: number,
    maxPlayers: number, 
    
    /** Make a full bag of letters suitable for use at the start
     * of a game. It returned bad is shuffled if appropriate.
     * (In general shuffling is appropriate. But for some test purposes,
     * an unshuffled bag make be perfered.)
     * The bag in always shuffled after an exchange of tile (even when
     * this would be unhelpful for testing.)  Aug 2021
     */
    makeFullBag : () => CoreTile[];
    boardLayout: SquareType[][];
    rackSize: number;
}


const standard : ScrabbleConfig = {
    name: "scrabble",
    displayName: "Scrabble",
    minPlayers: 1,
    maxPlayers: 4, 

    makeFullBag() : CoreTile[] {
        return shuffle(standardLetterSet.map(makeCoreTile));
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
};
Object.freeze(standard);


sAssert(standard.boardLayout.length === 15);
standard.boardLayout.forEach(row => sAssert(row.length === 15));


const simple: ScrabbleConfig = {
    name: "scrabble-simple",
    displayName: "Simple Scrabble (for testing)",
    minPlayers: 1,
    maxPlayers: 4,
    rackSize: 4,

    makeFullBag: () : CoreTile[] => {
        // Unshuffled to help with testing
        const letters : Letter[] = ["A", "B", "C", "?", 
            "D",  "E", "F", "?", 
            "G", "H", "I", "J"];
        return letters.map(makeCoreTile).reverse();
    },

    boardLayout: [
        [t, s, s, s, t,],
        [s, d, s, d, s,],
        [s, s, D, s, s,],
        [s, d, s, d, s,],
        [t, s, s, s, t,],

    ],

};
Object.freeze(simple);

export const configs = [standard, simple];



