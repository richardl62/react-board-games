import { Letter } from "../../config";
import { WordPosition } from "../word-position";

// Use of Click Move Start is a kludge
export interface PossibleWord {
    position: WordPosition;
    letters: Letter[];
}
