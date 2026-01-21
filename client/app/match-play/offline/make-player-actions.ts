import { AppGame, BoardProps } from "@/app-game-support";
import { endMatch, endTurn } from "@shared/game-control/ctx";
import { matchMove } from "@shared/game-control/match-action";
import { RandomAPI } from "@shared/utils/random-api";
import { OfflineMatchData } from "./make-initial-match-data";
import { MutableMatchData } from "@shared/server-match-data";

export function makePlayerActions(
    game: AppGame, 
    playerID: string,
    random: RandomAPI,
    matchData: OfflineMatchData, 
    setMatchData: (arg: OfflineMatchData) => void
): Pick<BoardProps, "moves" | "events"> {

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

    const events: BoardProps["events"] = {
        endTurn: () => doAction(md => {endTurn(md.ctxData); return md}),
        endMatch: () => doAction(md => {endMatch(md.ctxData); return md}),
    };
     
    const moves: BoardProps["moves"] = {};
    for (const moveName in game.moves) {
        moves[moveName] = (arg: unknown) => {
            doAction(md => matchMove(game, moveName, random, playerID, md, arg));
        };
    }

    return { moves, events };
}
