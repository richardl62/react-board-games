import { blank, Letter, letterScore } from "./letters";

/**
 * letter: Letter to display. Also used to check for valid words.
 * isBlank: True if the tile is a blank.
 * 
 * Note: letter === blank implies that the user has not selected a value (or that
 * a previously selected value was cleared.) 
*/
export interface CoreTile {
    letter: Letter;
    isBlank: boolean;
}

export function makeCoreTile(letter: Letter) : CoreTile {
    return {
        letter:letter,
        isBlank: letter === blank,
    }
}

export function tileScore(tile: CoreTile) {
    return (tile.isBlank) ? letterScore(blank) : letterScore(tile.letter);
}
