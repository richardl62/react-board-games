import { AppGame } from "shared/types";
import bobail from "./bobail";
import chess from "./chess";
import draughts from "./draughts";
import scrabble from "./scrabble";
import plusMinus from "./plus-minus";
import swapSquares from "./swap-squares";

export const games : Array<AppGame> = [
    ...bobail, 
    ...chess, 
    ...draughts, 
    ...scrabble,
    ...plusMinus,
    ...swapSquares,     
];