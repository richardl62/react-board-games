import { Ctx } from "boardgame.io";
import { SquareID } from "../../boards";
import { sameJSON, shuffle } from "../../shared/tools";
import { BoardData, GameData } from "./game-data";
import {
    getSquareData, setLetter, compactRack,
    fillRack, canSwapTiles, recallRack as doRecallRack
} from "./game-actions";
import { Letter } from "./scrabble-config";
import { sAssert } from "../../shared/assert";

type MoveParam = { from: SquareID, to: SquareID, };
const move = (G: GameData, ctx: Ctx, { from, to }: MoveParam) => {
    const rack = G.playerData[ctx.currentPlayer].playableTiles;
    const fromData = getSquareData(G, rack, from);
    const toData = getSquareData(G, rack, to);

    sAssert(fromData);

    if ((toData === null || toData.active) && !sameJSON(from, to)) {

        setLetter(G, rack, from, toData ? toData.letter : null);
        setLetter(G, rack, to, fromData.letter);
        compactRack(G, rack);
    }
};

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

interface EndOfTurnActionsParam {
    board: BoardData;
    rack: (Letter|null)[];
    score: number;
};

const endOfTurnActions = (G: GameData, ctx: Ctx, 
    {board, rack, score}: EndOfTurnActionsParam
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
    move: move,
    recallRack: recallRack,
    shuffleRack: shuffleRack,
    endOfTurnActions: endOfTurnActions,
    swapTilesInRack: swapTilesInRack,
};

export interface ClientMoves {
    move: (arg: MoveParam) => void;
    recallRack: (arg: RecallRackParam) => void;
    shuffleRack: (arg: ShuffleRackParam) => void;
    endOfTurnActions: (arg: EndOfTurnActionsParam) => void;
    swapTilesInRack: (arg: SwapTilesInRackParam) => void;
};