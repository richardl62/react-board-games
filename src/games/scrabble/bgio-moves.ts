import { Ctx } from "boardgame.io";
import { shuffle } from "../../shared/tools";
import { BoardData, GameData } from "./game-data";
import {
    fillRack, canSwapTiles, recallRack as doRecallRack
} from "./game-actions";
import { Letter } from "./scrabble-config";
import { sAssert } from "../../shared/assert";

type RecallRackParam = void;
const recallRack = (G: GameData, ctx: Ctx, dummy: RecallRackParam) => {
    const rack = G.playerData[ctx.currentPlayer].playableTiles;
    doRecallRack(G, rack);
};

type ShuffleRackParam = void;
const shuffleRack = (G: GameData, ctx: Ctx, dummy: ShuffleRackParam) => {
    const rack = G.playerData[ctx.currentPlayer].playableTiles;
    shuffle(rack);
};

interface setBoardRandAndScoreParam {
    board: BoardData;
    rack: (Letter|null)[];
    score: number;
};

const setBoardRandAndScore = (G: GameData, ctx: Ctx, 
    {board, rack, score}: setBoardRandAndScoreParam
    ) => {
    let newRack = [...rack];
    fillRack(G, newRack);
    G.playerData[ctx.currentPlayer].playableTiles = newRack;
    G.playerData[ctx.currentPlayer].score += score;

    G.board = board.map(row => row.map(
        sq => sq && {...sq, active: false}
    ));

    G.turn++;
};

type SwapTilesInRackParam = boolean[];
const swapTilesInRack = (G: GameData, ctx: Ctx, toSwap: SwapTilesInRackParam) => {
    if (!canSwapTiles(G)) {
        console.error("Invalid attempt to swap title");
        return;
    }
    const rack = G.playerData[ctx.currentPlayer].playableTiles;
    sAssert(rack.length === toSwap.length, "Problem swapping tiles");

    let removedLetters: Letter[] = [];
    for (let i = 0; i < rack.length; ++i) {
        if (toSwap[i]) {
            const l = rack[i];
            sAssert(l);
            removedLetters.push(l);
            rack[i] = null;
        }
    }

    fillRack(G, rack);

    G.bag.push(...removedLetters);
    shuffle(G.bag);
};

export const bgioMoves = {
    recallRack: recallRack,
    shuffleRack: shuffleRack,
    setBoardRandAndScore: setBoardRandAndScore,
    swapTilesInRack: swapTilesInRack,
};

export interface ClientMoves {
    recallRack: (arg: RecallRackParam) => void;
    shuffleRack: (arg: ShuffleRackParam) => void;
    setBoardRandAndScore: (arg: setBoardRandAndScoreParam) => void;
    swapTilesInRack: (arg: SwapTilesInRackParam) => void;
};