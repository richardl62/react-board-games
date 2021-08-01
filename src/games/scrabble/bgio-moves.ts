import { Ctx } from "boardgame.io";
import { SquareID } from "../../boards";
import { sameJSON, shuffle } from "../../shared/tools";
import { GameData } from "./game-data";
import { getSquareData, setLetter, compactRack,
    fillRack, canSwapTiles, recallRack } from "./game-actions";
import { Letter } from "./letter-properties";
import assert from "../../shared/assert";

export interface ClientMoves {
    start: (sq: SquareID) => void;

    move: (fromSq: SquareID, toSq: SquareID) => void;

    recallRack: () => void;

    shuffleRack: () => void;

    endOfTurnActions: () => void;
    recordScore: (score: number) => void;

    swapTilesInRack: (playerID: string, toSwap: boolean[]) => void; 
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

    endOfTurnActions: (G: GameData, ctx: Ctx) => {
        const rack = G.playerData[ctx.currentPlayer].rack;
        fillRack(G, rack);

        G.board.forEach(row => 
            row.forEach(sd => sd && (sd.active = false))
        );
    },

    recordScore: (G: GameData, ctx: Ctx, score: number) => {
        G.playerData[ctx.currentPlayer].score += score;
    },

    swapTilesInRack: (G: GameData, ctx: Ctx, playerID: string, toSwap: boolean[]) => {
        if(!canSwapTiles(G)) {
            console.error("Invalid attempt to swap title");
            return;
        }        
        let rack = G.playerData[playerID].rack;
        assert(rack.length === toSwap.length, "Problem swapping tiles");
        
        let removedLetters : Letter[] = [];
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
