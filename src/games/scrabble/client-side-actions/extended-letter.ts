import { blank, Letter, letterScore } from "../config";

/**
 * letter: Letter to display. Also used to check for valid words.
 * isBlank: True if the tile is a blank.
 * 
 * Note: letter === blank implies that the user has not selected a value (or that
 * a previously selected value was cleared.) 
*/
export interface ExtendedLetter {
    letter: Letter;
    isBlank: boolean;
}

export function makeExtendedLetter(letter: Letter) : ExtendedLetter {
    return {
        letter:letter,
        isBlank: letter === blank,
    };
}

export function tileScore(tile: ExtendedLetter): number {
    return (tile.isBlank) ? letterScore(blank) : letterScore(tile.letter);
}
