import { Move } from "boardgame.io";
import { nNonNull, shuffle } from "../../../shared/tools";
import { Letter, letterScore } from "../config";
import { BoardData, GlobalGameState } from "./global-game-state";
import { WordsPlayedInfo } from "./move-hstory";

type PassParm = void;
const pass: Move<GlobalGameState> = (G, ctx) => {
    G.moveHistory.push({pass: { pid: ctx.currentPlayer}});

    G.timestamp++;
};

interface SwapTilesParam {
    /**
     * The rack before the swap.  This should be the same set of tiles
     * as  G.playerData[ctx.currentPlayer].rack, but could be in a different
     * order.
     */
    rack: Letter[];

    /**
     * Array of the same size as rack. Indicated which of the tiles should be
     * swapped.
     */
    toSwap: boolean[];
} 

const swapTiles: Move<GlobalGameState> = (G, ctx,
    { rack: oldRack, toSwap }: SwapTilesParam
) => {

    const bag = G.bag;
    G.bag = bag;

    const newRack: Letter[] = [];

    let nSwapped = 0;    
    for (let ri = 0; ri < oldRack.length; ++ri) {
        if (toSwap[ri]) {
            const old = oldRack[ri];
            bag.push(old);
            newRack[ri] = bag.shift()!;
            ++nSwapped;
        } else {
            newRack[ri] = oldRack[ri];
        }
    }
    shuffle(bag);

    G.playerData[ctx.currentPlayer].rack = newRack;

    G.moveHistory.push({tilesSwapped: {
        pid: ctx.currentPlayer,
        nSwapped: nSwapped,
    }});

    G.timestamp++;
};

interface PlayWordParam {
    board: BoardData;
    rack: (Letter | null)[];
    playedWordinfo: Omit<WordsPlayedInfo,"pid">
    score: number;
} 

const playWord: Move<GlobalGameState> = (G, ctx,
    { board, rack: oldRack, playedWordinfo, score }: PlayWordParam
) => {
    const newRack = oldRack.map(l => {
        if(l) 
            return l;

        return G.bag.shift() || null;

    });
    G.playerData[ctx.currentPlayer].rack = newRack;
    G.playerData[ctx.currentPlayer].score += score;

    // KLUDGE: 'active' does not really belong server side
    G.board = board.map(row => row.map(
        sq => sq && { ...sq, active: false }
    ));

    const info = {
        ...playedWordinfo,
        pid: ctx.currentPlayer,
    };

    G.moveHistory.push({wordsPlayed: info});  
    
    // Play can continue after a winner has been declared, but end game
    // actions should happen only once.
    if(nNonNull(newRack) === 0 && G.bag.length === 0 && !G.winnerIds) {
        gameEndActions(G,  ctx.currentPlayer);
    }

    G.timestamp++;
};

function letterValue(rack: (Letter | null)[]) {
    let value = 0;
    for (const l of rack) {
        if (l) {
            value += letterScore(l);
        }
    }

    return value;
}

function findWinners(scores: {[id: string] : number} ) : string[] {
    let maxScore = -99999;
    for(const id in scores) {
        maxScore = Math.max(maxScore, scores[id]);
    }

    const winners = [];
    for(const id in scores) {
        if(scores[id] === maxScore) {
            winners.push(id);
        }
    }
    return winners;
}


function gameEndActions(G: GlobalGameState, playerOutPid: string) : void {
    const scoreAdjustement : {[id: string] : number} = {};
    let totalRackScores = 0;

    const playerData = G.playerData;
    for (const pid in playerData) {
        if (pid !== playerOutPid) {
            const rackScore = letterValue(playerData[pid].rack);
            totalRackScores += rackScore;
            scoreAdjustement[pid] = -rackScore;
        }
    }

    scoreAdjustement[playerOutPid] = totalRackScores;
    
    for(const id in scoreAdjustement) {
        G.playerData[id].score += scoreAdjustement[id];
    }

    G.moveHistory.push({scoresAdjusted: scoreAdjustement});

    const newScores : {[id: string] : number} = {};
    for(const pid in playerData) {
        newScores[pid] = playerData[pid].score + scoreAdjustement[pid];
    }

    const winners = findWinners(newScores);
    G.winnerIds = findWinners(newScores);
    G.moveHistory.push({gameOver: {winners: winners}} );
}

export const bgioMoves = {
    playWord: playWord,
    swapTiles: swapTiles,
    pass: pass,
};

export interface ClientMoves {
    playWord: (arg: PlayWordParam) => void;
    swapTiles: (arg: SwapTilesParam) => void;
    pass: (arg: PassParm) => void;
}