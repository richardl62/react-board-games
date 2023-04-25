
import { AppGameNoBoard } from "../app-game-support/app-game";
import { appGameNoBoard as acesUp } from "./aces-up/app-game-no-board";
import { appGameNoBoard as cribbage } from "./cribbage/app-game-no-board";
import { appGameNoBoard as crosstiles } from "./crosstiles/app-game-no-board";
import { appGameNoBoard as plusMinus } from "./plus-minus/app-game-no-board";
import { appGamesNoBoard as scrabble } from "./scrabble/app-games-no-board";
import { appGameNoBoard as swapSquares } from "./swap-squares/app-game-no-board";
import { appGameNoBoard as ticker } from "./ticker/app-game-no-board";
import { appGameNoBoard as dice } from "./dice/app-game-no-board";

export const gamesNoBoard : Array<AppGameNoBoard> = [
    acesUp,
    cribbage,
    crosstiles,
    plusMinus,
    ...scrabble,
    swapSquares, 
    ticker,
    dice,
];
