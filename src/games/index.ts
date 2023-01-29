import { AppGame } from "../app-game-support";
import scrabble from "./scrabble";
import cribbage from "./cribbage";
import crosstiles from "./crosstiles";
import plusMinus from "./plus-minus";
import swapSquares from "./swap-squares";

export const games : Array<AppGame> = [
    ...scrabble,
    ...cribbage,
    ...crosstiles,  
    ...plusMinus,
    ...swapSquares,
];