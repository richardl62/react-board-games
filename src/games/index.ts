import { AppGame } from "../app-game-support";
import acesUp from "./aces-up";
import cribbage from "./cribbage";
import crosstiles from "./crosstiles";
import plusMinus from "./plus-minus";
import scrabble from "./scrabble";
import swapSquares from "./swap-squares";
import ticker from "./ticker";

export const games : Array<AppGame> = [
    ...scrabble,
    ...acesUp,
    ...cribbage,
    ...crosstiles,
    ...plusMinus,
    ...swapSquares, 
    ...ticker,
];