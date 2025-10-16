import { GameControl } from "@/game-controlX/game-control";
import { appGameNoBoard as g5000 } from "@/game-controlX/games/5000/game-control";
import { appGameNoBoard as acesUp } from "@/game-controlX/games/aces-up/game-control";
import { appGameNoBoard as cribbage } from "./cribbage/app-game-no-board";
import { appGameNoBoard as crosstiles } from "./crosstiles/app-game-no-board";
import { gameControl as plusMinus } from "@/game-controlX/games/plus-minus/game-control";
import { appGamesNoBoard as scrabble } from "./scrabble/app-games-no-board";
import { appGameNoBoard as swapSquares } from "@/game-controlX/games/swap-squares/game-control";
import { appGameNoBoard as ticker } from "../game-controlX/games/ticker/game-control";

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
