import { Ctx } from "boardgame.io";
import { SquareID } from "../../boards";
import { sameJSON, shuffle } from "../../shared/tools";
import { GameData } from "./game-data";
import {
    getSquareData, setLetter, compactRack,
    fillRack, canSwapTiles, recallRack as doRecallRack
} from "./game-actions";
import { Letter } from "./scrabble-config";
import { sAssert } from "../../shared/assert";

type StartParam = SquareID;
const start = (G: GameData, ctx: Ctx, sq: StartParam) => {
    G.moveStart = sq;
};

type MoveParam = { from: SquareID, to: SquareID, };
const move = (G: GameData, ctx: Ctx, { from, to }: MoveParam) => {
    const rack = G.playerData[ctx.currentPlayer].rack;
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
    const rack = G.playerData[ctx.currentPlayer].rack;
    doRecallRack(G, rack);
};

type ShuffleRackParam = void;
const shuffleRack = (G: GameData, ctx: Ctx, dummy: ShuffleRackParam) => {
    const rack = G.playerData[ctx.currentPlayer].rack;
    shuffle(rack);
};

type EndOfTurnActionsParam = number;
const endOfTurnActions = (G: GameData, ctx: Ctx, score: EndOfTurnActionsParam) => {
    G.playerData[ctx.currentPlayer].score += score;
    const rack = G.playerData[ctx.currentPlayer].rack;
    fillRack(G, rack);

    G.board.forEach(row =>
        row.forEach(sd => sd && (sd.active = false))
    );
};

type SwapTilesInRackParam = boolean[];
const swapTilesInRack = (G: GameData, ctx: Ctx, toSwap: SwapTilesInRackParam) => {
    if (!canSwapTiles(G)) {
        console.error("Invalid attempt to swap title");
        return;
    }
    const rack = G.playerData[ctx.currentPlayer].rack;
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
    start: start,
    move: move,
    recallRack: recallRack,
    shuffleRack: shuffleRack,
    endOfTurnActions: endOfTurnActions,
    swapTilesInRack: swapTilesInRack,
};

export interface ClientMoves {
    start: (arg: StartParam) => void;
    move: (arg: MoveParam) => void;
    recallRack: (arg: RecallRackParam) => void;
    shuffleRack: (arg: ShuffleRackParam) => void;
    endOfTurnActions: (arg: EndOfTurnActionsParam) => void;
    swapTilesInRack: (arg: SwapTilesInRackParam) => void;
};