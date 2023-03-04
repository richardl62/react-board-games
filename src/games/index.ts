import { AppGame } from "../app-game-support";
import acesUp from "./aces-up";
import counter from "./counter";
import cribbage from "./cribbage";
import crosstiles from "./crosstiles";
import plusMinus from "./plus-minus";
import scrabble from "./scrabble";
import swapSquares from "./swap-squares";

export const games : Array<AppGame> = [
    ...scrabble,
    ...acesUp,
    ...counter,
    ...cribbage,
    ...crosstiles,
    ...swapSquares,
    ...plusMinus, 
];