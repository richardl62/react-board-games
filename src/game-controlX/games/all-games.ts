import { GameControl } from "@/game-controlX/game-control";
import { appGameNoBoard as g5000 } from "./5000/game-control";
import { appGameNoBoard as acesUp } from "./aces-up/game-control";
import { appGameNoBoard as cribbage } from "./cribbage/game-control";
import { appGameNoBoard as crosstiles } from "./crosstiles/game-control";
import { gameControl as plusMinus } from "./plus-minus/game-control";
import { appGamesNoBoard as scrabble } from "./scrabble/game-control";
import { appGameNoBoard as swapSquares } from "./swap-squares/game-control";
import { appGameNoBoard as ticker } from "./ticker/game-control";

export const gamesNoBoard : Array<GameControl> = [
    acesUp,
    cribbage,
    crosstiles,
    g5000,
    plusMinus,
    ...scrabble,
    swapSquares, 
    ticker,
];
