import { AppGame } from "@/app-game-support";
import { endMatch, endTurn } from "@shared/game-control/ctx";
import { matchMove } from "@shared/game-control/match-action";
import { RandomAPI } from "@shared/utils/random-api";
import { OfflineMatchData } from "./make-initial-match-data";
import { MutableMatchData } from "@shared/server-match-data";
import { UntypedMoves } from "@/app-game-support/wrapped-match-props";
import { EventsAPI } from "@shared/game-control/events";

export function makePlayerActions(
    game: AppGame, 
    playerID: string,
    random: RandomAPI,
    matchData: OfflineMatchData, 
    setMatchData: (arg: OfflineMatchData) => void
): { moves: UntypedMoves; events: EventsAPI } {

    const doAction = (action: (md: MutableMatchData) => MutableMatchData) => {
        try {
            const mutatedData = action(matchData)
            setMatchData({
                ...mutatedData,
                playerData: matchData.playerData,
                errorInLastAction: null,
            });
        } catch (e) {
            const errorInLastAction = (e instanceof Error) ? e.message : `Unrecognised error: ${String(e)}`;
            setMatchData({
                ...matchData,
                errorInLastAction,
            });
        }
    };

    const events: EventsAPI = {
        endTurn: () => doAction(md => {endTurn(md.ctxData); return md}),
        endMatch: () => doAction(md => {endMatch(md.ctxData); return md}),
    };
     
    const moves: UntypedMoves = {};
    for (const moveName in game.moves) {
        moves[moveName] = (arg: unknown) => {
            doAction(md => matchMove(game, moveName, random, playerID, md, arg));
        };
    }

    return { moves, events };
}
