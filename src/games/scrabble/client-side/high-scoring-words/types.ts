import { Letter } from "../../config";

export interface PossibleWord {
    start: { row: number; column: number; };
    vertical: boolean;
    letters: Letter[];
}
