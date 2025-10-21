import { GameControl } from "../game-control.js";
import { appGameNoBoard as g5000 } from "./5000/game-control.js";
import { appGameNoBoard as acesUp } from "./aces-up/game-control.js";
import { appGameNoBoard as cribbage } from "./cribbage/game-control.js";
import { appGameNoBoard as crosstiles } from "./crosstiles/game-control.js";
import { gameControl as plusMinus } from "./plus-minus/game-control.js";
import { appGamesNoBoard as scrabble } from "./scrabble/game-control.js";
import { appGameNoBoard as swapSquares } from "./swap-squares/game-control.js";
import { appGameNoBoard as ticker } from "./ticker/game-control.js";

export const allGames : Array<GameControl> = [
    acesUp,
    cribbage,
    crosstiles,
    g5000,
    plusMinus,
    ...scrabble,
    swapSquares, 
    ticker,
];
