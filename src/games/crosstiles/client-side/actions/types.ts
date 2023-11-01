import { WordDirection } from "../../../../utils/word-finder/get-legal-words/word-position";

interface RackID {
    row?: undefined,
    col: number,
    container: "rack";
}

interface GridID {
    row: number,
    col: number,
    container: "grid";
}

export type SquareID = RackID | GridID;

export function sameSquareID(s1: SquareID, s2: SquareID) : boolean {
    // No need to check 'container' as row === undefined also determines if
    // the square is on grid or rack.
    return s1.row === s2.row && s1.col === s2.col; 
}

export interface ClickMoveStart {
    row: number;
    col: number;
    direction: WordDirection;
} 
