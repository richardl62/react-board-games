import { Move } from "boardgame.io";
import { Letter } from "../config";
import { BoardData, GlobalGameState, MoveHistoryElement } from "./global-game-state";

interface setBoardRandAndScoreParam {
    board: BoardData;
    rack: (Letter | null)[];
    bag: Letter[];
    score: number;

    historyElement: MoveHistoryElement;
}

const setBoardRandAndScore: Move<GlobalGameState> = (G, ctx,
    { board, rack, bag, score, historyElement }: setBoardRandAndScoreParam
) => {

    G.bag = bag;
    G.playerData[ctx.currentPlayer].rack = rack;
    G.playerData[ctx.currentPlayer].score += score;

    // KLUDGE: 'active' does not really belong server side
    // And if it did, the logic for setting it might be better
    // client side.
    G.board = board.map(row => row.map(
        sq => sq && { ...sq, active: false }
    ));

    G.turn++;
    G.timestamp++;

    G.moveHistory.push(historyElement);
};

export const bgioMoves = {
    setBoardRandAndScore: setBoardRandAndScore,
};

export interface ClientMoves {
    setBoardRandAndScore: (arg: setBoardRandAndScoreParam) => void;
}