import { Move } from "boardgame.io";
import { CoreTile } from "./core-tile";
import { BoardData, GameData } from "./game-data";

interface setBoardRandAndScoreParam {
    board: BoardData;
    rack: (CoreTile | null)[];
    bag: CoreTile[];
    score: number;
}

const setBoardRandAndScore: Move<GameData> = (G, ctx,
    { board, rack, bag, score }: setBoardRandAndScoreParam
) => {

    G.bag = bag;
    G.playerData[ctx.currentPlayer].playableTiles = rack;
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

export const bgioMoves = {
    setBoardRandAndScore: setBoardRandAndScore,
};

export interface ClientMoves {
    setBoardRandAndScore: (arg: setBoardRandAndScoreParam) => void;
}
