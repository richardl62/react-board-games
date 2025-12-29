import { GameControl } from "../game-control.js";
import { gameControl as g5000 } from "./5000/game-control.js";
import { gameControl as acesUp } from "./aces-up/game-control.js";
import { gameControl as cantStop } from "./cant-stop/game-control.js";
import { gameControl as cribbage } from "./cribbage/game-control.js";
import { gameControl as crosstiles } from "./crosstiles/game-control.js";
import { gameControl as plusMinus } from "./plus-minus/game-control.js";
import { gameControl as scrabble } from "./scrabble/game-control.js";
import { gameControl as swapSquares } from "./swap-squares/game-control.js";
import { gameControl as ticker } from "./ticker/game-control.js";
import { gameControl as randomdraw } from "./random-draw/game-control.js";

export const allGames : Array<GameControl> = [
    g5000,
    acesUp,
    cantStop,
    cribbage,
    crosstiles,
    g5000,
    plusMinus,
    ...scrabble,
    swapSquares, 
    ticker,
    randomdraw,
];
