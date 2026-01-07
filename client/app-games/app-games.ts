import { allGames as gameControlGames } from "@game-control/games/all-games";
import { AppGame } from "../app-game-support";
import { appGame as g5000 } from "./5000/app-game";
import { appGame as acesUp } from "./aces-up/app-game";
import { appGame as cantStop } from "./cant-stop/app-game";
import { appGame as cribbage } from "./cribbage/app-game";
import { appGame as crosstiles } from "./crosstiles/app-game";
import { appGame as plusMinus } from "./plus-minus/app-game";
import { appGames as scrabble } from "./scrabble/app-games";
import { appGame as swapSquares } from "./swap-squares/app-game";
import { appGame as ticker } from "./ticker/app-game";
import { appGame as randomDraw } from "./random-draw/app-game";

export const appGames : Array<AppGame> = [
    g5000,
    acesUp,
    cantStop,
    cribbage,
    plusMinus,
    crosstiles,
    ...scrabble,
    swapSquares, 
    ticker,
    randomDraw,
];

const appGameNames = appGames.map(ag => ag.name).sort().join(",");
const gameControlNames = gameControlGames.map(g => g.name).sort().join(",");

if(appGameNames !== gameControlNames) {
    console.error("appGames and gameControlGames differ:");
    console.log("appGame:", appGameNames);
    console.log("gameControl:", gameControlNames);
};

