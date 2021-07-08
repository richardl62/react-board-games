import { SquareID } from "../../boards";
import { sameJSON, shuffle } from "../../shared/tools";
import { GameData } from "./game-data";
import { canChange, getSquareData, setLetter, RackAction, compactRack,
     addToRack, playerNumber, fillRack } from "./game-actions";

export const bgioMoves = {
    start: (G: GameData, ctx: any, sq: SquareID) => {
        G.moveStart = sq;
    },

    move: (G: GameData, ctx: any, fromSq: SquareID, toSq: SquareID) => {
        if (canChange(G, toSq) && !sameJSON(fromSq, toSq)) {
            const squareData = getSquareData(G, fromSq);
            setLetter(G, fromSq, null);
            setLetter(G, toSq, squareData && squareData.letter, RackAction.insert);
            compactRack(G);
        }
    },

    recallRack: (G: GameData, ctx: any) => {
        for (let row = 0; row < G.board.length; ++row) {
            for (let col = 0; col < G.board[row].length; ++col) {
                let sq = G.board[row][col];
                if (sq?.active) {
                    addToRack(G, sq.letter);
                    G.board[row][col] = null;
                }
            }
        }
    },

    shuffleRack: (G: GameData, ctx: any) => {
        shuffle(G.playerData[playerNumber].rack);
    },

    finishTurn: (G: GameData, ctx: any, score: number) => {
        fillRack(G);

        G.board.forEach(row => 
            row.forEach(sd => sd && (sd.active = false))
        );

        G.playerData[playerNumber].score += score;
    }
};
