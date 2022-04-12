import { shuffle } from "../../../utils/shuffle";
import { Letter, letterDistrubtion, nTilesPerTurn } from "../config";
import { ServerData } from "./server-data";


export function selectTiles() : Letter[] {

    const letterSet: Array<Letter> = [];

    let letter: Letter;
    for (letter in letterDistrubtion) {
        const count = letterDistrubtion[letter];
        for (let i = 0; i < count; ++i) {
            letterSet.push(letter);
        }
    }
    
    shuffle(letterSet);
    
    return letterSet.slice(0, nTilesPerTurn);
}

export type ChangeSelectTilesParam = void;


export function changeSelectedTiles(state: ServerData) : void {
    state.selectedLetters = selectTiles();
}