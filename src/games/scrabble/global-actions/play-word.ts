import { Ctx } from "boardgame.io";
import { nNonNull } from "../../../utils/n-non-null";
import { Letter, letterScore } from "../config";
import { BoardData, GameState } from "./game-state";
import { ServerData } from "./server-data";
import { WordsPlayedInfo } from "./move-hstory";


export interface PlayWordParam {
    board: BoardData;
    rack: (Letter | null)[];
    playedWordinfo: Omit<WordsPlayedInfo,"pid">
    score: number;
} 

export function playWord(
    state: GameState, 
    ctx: Ctx,
    { board, rack: inputRack, playedWordinfo, score }: PlayWordParam
) : void
{
    const newBag = [...state.bag];
    const newRack = [...inputRack];
    
    for(let ri = 0; ri < newRack.length; ++ri) {
        if(!newRack[ri]) {
            newRack[ri] = newBag.shift() || null;
        }
    }

    state.playerData[ctx.currentPlayer].rack = newRack;
    state.playerData[ctx.currentPlayer].score += score;
    state.bag = newBag;

    // KLUDGE: 'active' does not really belong server side
    state.board = board.map(row => row.map(
        sq => sq && { ...sq, active: false }
    ));

    const info = {
        ...playedWordinfo,
        pid: ctx.currentPlayer,
    };

    state.moveHistory.push({wordsPlayed: info});  
    
    // Play can continue after a winner has been declared, but end game
    // actions should happen only once.
    if(nNonNull(newRack) === 0 && state.bag.length === 0 && !state.winnerIds) {
        gameEndActions(state,  ctx.currentPlayer);
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

function findWinners(playerData: ServerData["states"][0]["playerData"]) : string[] {
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


function gameEndActions(state: GameState, playerOutPid: string) : void {
    
    const scoreAdjustement : {[id: string] : number} = {};
    let totalRackScores = 0;

    const playerData = state.playerData;
    for (const pid in playerData) {
        if (pid !== playerOutPid) {
            const rackScore = letterValue(playerData[pid].rack);
            totalRackScores += rackScore;
            scoreAdjustement[pid] = -rackScore;
        }
    }

    scoreAdjustement[playerOutPid] = totalRackScores;
    
    for(const id in scoreAdjustement) {
        state.playerData[id].score += scoreAdjustement[id];
    }

    state.moveHistory.push({scoresAdjusted: scoreAdjustement});

    const winners = findWinners(state.playerData);
    state.winnerIds = winners;
    state.moveHistory.push({gameOver: {winners: winners}} );
}