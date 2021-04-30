import { makeBasicGridGame } from "../layout/grid-based-board/make-basic-grid-game";
import { BasicGame } from "../shared/types";
import { bobailInput } from "./bobail/bobail-input";
import { chessInput } from "./chess/chess-input";
import { draughtsInput } from "./draughts/draughts-input";
import { plusminusInput } from "./plus-minus/plus-minus-input";

export const games : Array<BasicGame> = [
    ...bobailInput.map(makeBasicGridGame),
    ...chessInput.map(makeBasicGridGame),
    ...draughtsInput.map(makeBasicGridGame),
    ...plusminusInput, 
];
