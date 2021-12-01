import { Move } from "boardgame.io";
import { Letter } from "../config";
import { BoardData, GlobalGameState, MoveHistoryElement } from "./global-game-state";

interface SetBoardRandAndScoreParam {
    board: BoardData;
    rack: (Letter | null)[];
    bag: Letter[];
    score: number;
}

const setBoardRandAndScore: Move<GlobalGameState> = (G, ctx,
    { board, rack, bag, score }: SetBoardRandAndScoreParam
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
};

type AddHistoryParam = MoveHistoryElement;
const addHistory: Move<GlobalGameState> = (G, ctx,
    historyElement : AddHistoryParam
) => {

    G.moveHistory.push(historyElement);
};

export const bgioMoves = {
    setBoardRandAndScore: setBoardRandAndScore,
    addHistory: addHistory,
};

export interface ClientMoves {
    setBoardRandAndScore: (arg: SetBoardRandAndScoreParam) => void;
    addHistory: (arg: AddHistoryParam) => void;
}