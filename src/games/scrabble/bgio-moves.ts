import { SquareID } from "../../boards";
import { sameJSON, shuffle } from "../../shared/tools";
import { GameData } from "./game-data";
import { getSquareData, setLetter, compactRack,
    fillRack, canSwapTiles, recallRack, selectNextPlayer } from "./game-actions";
import { Letter } from "./letter-properties";
import assert from "../../shared/assert";

export interface ClientMoves {
    start: (sq: SquareID) => void;

    move: (fromSq: SquareID, toSq: SquareID) => void;

    recallRack: () => void;

    shuffleRack: () => void;

    finishTurn: (score: number) => void;

    pass: () => void;

    swapTilesInRack: (toSwap: boolean[]) => void; 
};

export const bgioMoves = {
    start: (G: GameData, ctx: any, sq: SquareID) => {
        G.moveStart = sq;
    },

    move: (G: GameData, ctx: any, fromSq: SquareID, toSq: SquareID) => {
        const fromData = getSquareData(G, fromSq);
        const toData = getSquareData(G, toSq);

        assert(fromData);

        if ((toData === null || toData.active) && !sameJSON(fromSq, toSq)) {

            setLetter(G, fromSq, toData ? toData.letter : null);
            setLetter(G, toSq, fromData.letter);
            compactRack(G);
        }
    },

    recallRack: (G: GameData, ctx: any) => {

    },

    shuffleRack: (G: GameData, ctx: any) => {
        shuffle(G.playerData[G.currentPlayer].rack);
    },

    finishTurn: (G: GameData, ctx: any, score: number) => {
        fillRack(G);

        G.board.forEach(row => 
            row.forEach(sd => sd && (sd.active = false))
        );

        G.playerData[G.currentPlayer].score += score;
        selectNextPlayer(G);
    },

    pass: (G: GameData, ctx: any) => {
        recallRack(G);
        selectNextPlayer(G);
    },

    swapTilesInRack: (G: GameData, ctx: any, toSwap: boolean[]) => {
        canSwapTiles(G);

        let {rack} = G.playerData[G.currentPlayer];
        let removedLetters : Letter[] = [];
        for(let i = 0; i < rack.length; ++i) {
            if(toSwap[i]) {
                const l = rack[i];
                assert(l);
                removedLetters.push(l);
                rack[i] = null;
            }
        }

        fillRack(G);

        G.bag.push(...removedLetters);
        shuffle(G.bag);
    },
};
