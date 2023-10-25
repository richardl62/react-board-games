import { Letter } from "../../config";
import { ClickMoveStart } from "../click-move-start";

// Use of Click Move Start is a kludge
export interface PossibleWord {
    position: ClickMoveStart;
    letters: Letter[];
}
