import { AppGame } from "../app-game-support";
import { appGame as acesUp } from "./aces-up/app-game";
import { appGame as cribbage } from "./cribbage/app-game";
import { appGame as crosstiles } from "./crosstiles/app-game";
import { appGame as plusMinus } from "./plus-minus/app-game";
import { appGames as scrabble } from "./scrabble/app-games";
import { appGame as swapSquares } from "./swap-squares/app-game";
import { appGame as ticker } from "./ticker/app-game";

export const games : Array<AppGame> = [
    acesUp,
    cribbage,
    crosstiles,
    plusMinus,
    ...scrabble,
    swapSquares, 
    ticker,
];
