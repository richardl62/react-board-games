import { WordPosition } from "../word-position";

// Use of Click Move Start is a kludge
export interface PossibleWord extends WordPosition {
    word: string;
}
