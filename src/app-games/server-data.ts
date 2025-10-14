import { GameControl } from "@/game-controlX/game-control";
import { appGameNoBoard as g5000 } from "./5000/app-game-no-board";
import { appGameNoBoard as acesUp } from "./aces-up/app-game-no-board";
import { appGameNoBoard as cribbage } from "./cribbage/app-game-no-board";
import { appGameNoBoard as crosstiles } from "./crosstiles/app-game-no-board";
import { gameControl as plusMinus } from "@/game-controlX/games/plus-minus/game-control";
import { appGamesNoBoard as scrabble } from "./scrabble/app-games-no-board";
import { appGameNoBoard as swapSquares } from "@/game-controlX/games/swap-squares/game-control";
import { appGameNoBoard as ticker } from "./ticker/app-game-no-board";

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
