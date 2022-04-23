import { ClickMoveDirection } from "../../../../utils/board/click-move-marker";

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

export interface ClickMoveStart {
    row: number;
    col: number;
    direction: ClickMoveDirection;
} 
