import { AppGame } from "../shared/types";
import scrabble from "./scrabble";
import plusMinus from "./plus-minus";
import swapSquares from "./swap-squares";

export const games : Array<AppGame> = [
    ...scrabble,
    ...plusMinus,
    ...swapSquares,     
];