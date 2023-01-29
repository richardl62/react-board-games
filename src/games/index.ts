import { AppGame } from "../app-game-support";
import scrabble from "./scrabble";
import cribbage from "./cribbage";
import crosstiles from "./crosstiles";
import boilerplate from "./boilerplate";
import plusMinus from "./plus-minus";
import swapSquares from "./swap-squares";

export const games : Array<AppGame> = [
    ...scrabble,
    ...cribbage,
    ...crosstiles,
    ...boilerplate, 
    ...plusMinus,
    ...swapSquares,
];