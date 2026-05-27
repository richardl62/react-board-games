import { AppGame } from "@/app-game-support";
import { UntypedMoves } from "@/app-game-support/board-props";
import { EventsAPI } from "@shared/game-control/events";
import { WsRequestedAction } from "@shared/ws-requested-action";
import { applyActionLocally } from "../apply-action-locally";
import { OfflineMatchData } from "./make-initial-match-data";

export function makePlayerActions(
    game: AppGame,
    playerID: string,
    matchData: OfflineMatchData,
    setMatchData: (arg: OfflineMatchData) => void
): { moves: UntypedMoves; events: EventsAPI } {

    const doAction = (action: WsRequestedAction) => {
        try {
            const mutated = applyActionLocally(game, action, playerID, matchData);
            setMatchData({ ...mutated, errorInLastAction: null });
        } catch (e) {
            const errorInLastAction = (e instanceof Error) ? e.message : `Unrecognised error: ${String(e)}`;
            setMatchData({ ...matchData, errorInLastAction });
        }
    };

    const events: EventsAPI = {
        endTurn: () => doAction({ endTurn: true }),
        endMatch: () => doAction({ endMatch: true }),
    };

    const moves: UntypedMoves = {};
    for (const moveName in game.moves) {
        moves[moveName] = (arg: unknown) => doAction({ move: moveName, arg });
    }

    return { moves, events };
}
