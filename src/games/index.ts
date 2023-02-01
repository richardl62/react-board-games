import { AppGame } from "../app-game-support";
import scrabble from "./scrabble";
import cribbage from "./cribbage";
import crosstiles from "./crosstiles";
import swapSquares from "./swap-squares";
import plusMinus from "./plus-minus";

export const games : Array<AppGame> = [
    ...scrabble,
    ...cribbage,
    ...crosstiles,
    ...swapSquares,
    ...plusMinus, 
];