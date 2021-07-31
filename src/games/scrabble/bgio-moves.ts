import { Ctx } from "boardgame.io";
import { SquareID } from "../../boards";
import { sameJSON, shuffle } from "../../shared/tools";
import { GameData, Rack } from "./game-data";
import { getSquareData, setLetter, compactRack,
    fillRack, canSwapTiles, recallRack } from "./game-actions";
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
    start: (G: GameData, ctx: Ctx, sq: SquareID) => {
        G.moveStart = sq;
    },

    move: (G: GameData, ctx: Ctx, fromSq: SquareID, toSq: SquareID) => {
        const rack = G.playerData[ctx.currentPlayer].rack;
        const fromData = getSquareData(G, rack, fromSq);
        const toData = getSquareData(G, rack, toSq);

        assert(fromData);

        if ((toData === null || toData.active) && !sameJSON(fromSq, toSq)) {

            setLetter(G, rack, fromSq, toData ? toData.letter : null);
            setLetter(G, rack, toSq, fromData.letter);
            compactRack(G, rack);
        }
    },

    recallRack: (G: GameData, ctx: Ctx) => {
        const rack = G.playerData[ctx.currentPlayer].rack;
        recallRack(G, rack);
    },

    shuffleRack: (G: GameData, ctx: Ctx) => {
        const rack = G.playerData[ctx.currentPlayer].rack;
        shuffle(rack);
    },

    finishTurn: (G: GameData, ctx: Ctx, score: number) => {
        const rack = G.playerData[ctx.currentPlayer].rack;
        fillRack(G, rack);

        G.board.forEach(row => 
            row.forEach(sd => sd && (sd.active = false))
        );

        G.playerData[ctx.currentPlayer].score += score;
    },

    pass: (G: GameData, ctx: Ctx) => {
        const rack = G.playerData[ctx.currentPlayer].rack;
        recallRack(G, rack);
    },

    swapTilesInRack: (G: GameData, rack: Rack, toSwap: boolean[]) => {
        canSwapTiles(G);        let removedLetters : Letter[] = [];
        for(let i = 0; i < rack.length; ++i) {
            if(toSwap[i]) {
                const l = rack[i];
                assert(l);
                removedLetters.push(l);
                rack[i] = null;
            }
        }

        fillRack(G, rack);

        G.bag.push(...removedLetters);
        shuffle(G.bag);
    },
};
