import { AppGame } from "@/app-game-support";
import { endTurn, endMatch } from "@shared/game-control/ctx";
import { matchMove } from "@shared/game-control/match-action";
import { RandomAPI } from "@shared/utils/random-api";
import { ServerMatchData } from "@shared/server-match-data";
import { WsRequestedAction, isWsMove, isWsEndTurn } from "@shared/ws-requested-action";

// Apply a move or event to matchData using local game logic and return the new state.
// Throws if the action is invalid (e.g. wrong player, illegal move).
export function applyActionLocally(
    appGame: AppGame,
    action: WsRequestedAction,
    playerID: string,
    matchData: ServerMatchData,
): ServerMatchData {
    if (isWsMove(action)) {
        const random = RandomAPI.fromState(matchData.prngState);
        const mutated = matchMove(appGame, action.move, random, playerID, matchData, action.arg);
        return { ...mutated, playerData: matchData.playerData, prngState: random.getState() };
    }

    const { ctxData, state } = structuredClone(matchData);
    if (isWsEndTurn(action)) {
        endTurn(ctxData);
    } else {
        endMatch(ctxData);
    }
    return { ctxData, state, playerData: matchData.playerData, prngState: matchData.prngState };
}
