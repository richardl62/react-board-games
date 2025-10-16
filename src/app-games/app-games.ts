import { AppGame } from "../app-game-support";
import { GameControl } from "@/game-controlX/game-control";
import { sAssert } from "../utils/assert";
import { appGame as acesUp } from "./aces-up/app-game";
import { gamesNoBoard } from "./game-control";
import { appGame as cribbage } from "./cribbage/app-game";
import { appGame as crosstiles } from "./crosstiles/app-game";
import { appGame as plusMinus } from "./plus-minus/app-game";
import { appGames as scrabble } from "./scrabble/app-games";
import { appGame as swapSquares } from "./swap-squares/app-game";
import { appGame as ticker } from "./ticker/app-game";
import { appGame as g5000 } from "./5000/app-game";

export const appGames : Array<AppGame> = [
    g5000,
    acesUp,
    cribbage,
    plusMinus,
    crosstiles,
    ...scrabble,
    swapSquares, 
    ticker,
];

function sameGames(g1: GameControl[], g2: GameControl[]) {
    const names1 = g1.map(g => g.name);
    const names2 = g2.map(g => g.name);

    return JSON.stringify(names1.sort()) === JSON.stringify(names2.sort());
}

sAssert(sameGames(appGames, gamesNoBoard),"List of games with and without board differ");
