import { Ctx } from "boardgame.io";
import { nNonNull } from "../../../utils/n-non-null";
import { Letter, letterScore } from "../config";
import { GameState } from "./game-state";
import { ServerData } from "./server-data";

function letterValue(rack: (Letter | null)[]) {
    let value = 0;
    for (const l of rack) {
        if (l) {
            value += letterScore(l);
        }
    }

    return value;
}
function findWinners(playerData: ServerData["states"][0]["playerData"]): string[] {
    let maxScore = -99999;
    for (const pid in playerData) {
        maxScore = Math.max(maxScore, playerData[pid].score);
    }

    const winners = [];
    for (const pid in playerData) {
        if (playerData[pid].score === maxScore) {
            winners.push(pid);
        }
    }
    return winners;
}

function gameEndActions(state: GameState, playerOutPid: string | null): void {

    const scoreAdjustement: { [id: string]: number; } = {};
    let totalRackScores = 0;

    const playerData = state.playerData;
    for (const pid in playerData) {
        if (pid !== playerOutPid) {
            const rackScore = letterValue(playerData[pid].rack);
            totalRackScores += rackScore;
            scoreAdjustement[pid] = -rackScore;
        }
    }

    if (playerOutPid) {
        scoreAdjustement[playerOutPid] = totalRackScores;
    }

    for (const id in scoreAdjustement) {
        state.playerData[id].score += scoreAdjustement[id];
    }

    state.moveHistory.push({ scoresAdjusted: scoreAdjustement });

    const winners = findWinners(state.playerData);
    state.winnerIds = winners;
    state.moveHistory.push({ gameOver: { winners: winners } });
}

// KLUDGE?: Uses moveHistory to check for passes
function allPlayersPassed(ctx: Ctx, state: GameState) : boolean {
    const { moveHistory } = state;
    const nPlayers = ctx.playOrder.length;

    if(nPlayers > moveHistory.length) {
        return false;
    }

    for(let index = 1; index <= nPlayers; ++index) {
        if (!moveHistory[moveHistory.length - index].pass) {
            return false;
        }
    }

    return true;
}

export function checkForWinner(state: GameState, ctx: Ctx) : void {
    // Play can continue after a winner has been declared, but end game
    // actions should happen only once.
    if (state.winnerIds) {
        return;
    }

    const rack = state.playerData[ctx.currentPlayer].rack;
    // Play can continue after a winner has been declared, but end game
    // actions should happen only once.
    if (nNonNull(rack) === 0 && state.bag.length === 0) {
        gameEndActions(state, ctx.currentPlayer);
    } else if (allPlayersPassed(ctx, state)) {
        gameEndActions(state, null);
    }
}


