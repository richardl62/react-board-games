import { Ctx } from "boardgame.io";
import { nNonNull } from "../../../utils/n-non-null";
import { Letter, letterScore } from "../config";
import { BoardData, GlobalGameState } from "./global-game-state";
import { WordsPlayedInfo } from "./move-hstory";


export interface PlayWordParam {
    board: BoardData;
    rack: (Letter | null)[];
    playedWordinfo: Omit<WordsPlayedInfo,"pid">
    score: number;
} 

export function playWord(G: GlobalGameState, ctx: Ctx,
    { board, rack: inputRack, playedWordinfo, score }: PlayWordParam
) : void
{
    const newBag = [...G.bag];
    const newRack = [...inputRack];
    
    for(let ri = 0; ri < newRack.length; ++ri) {
        if(!newRack[ri]) {
            newRack[ri] = newBag.shift() || null;
        }
    }

    G.playerData[ctx.currentPlayer].rack = newRack;
    G.playerData[ctx.currentPlayer].score += score;
    G.bag = newBag;

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
}

function letterValue(rack: (Letter | null)[]) {
    let value = 0;
    for (const l of rack) {
        if (l) {
            value += letterScore(l);
        }
    }

    return value;
}

function findWinners(playerData: GlobalGameState["playerData"]) : string[] {
    let maxScore = -99999;
    for(const pid in playerData) {
        maxScore = Math.max(maxScore, playerData[pid].score);
    }

    const winners = [];
    for(const pid in playerData) {
        if(playerData[pid].score === maxScore) {
            winners.push(pid);
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

    const winners = findWinners(G.playerData);
    G.winnerIds = winners;
    G.moveHistory.push({gameOver: {winners: winners}} );
}