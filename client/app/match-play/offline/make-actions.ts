import { AppGame, BoardProps } from "@/app-game-support";
import { ServerCtx } from "@shared/game-control/ctx";
import { doMatchAction, matchMove } from "@shared/game-control/match-action";
import { ServerMatchData } from "@shared/server-match-data";
import { RandomAPI } from "@shared/utils/random-api";

export function makeActions(
    game: AppGame, 
    playerID: string,
    random: RandomAPI,
    matchData: ServerMatchData, 
    setMatchData: (arg: ServerMatchData) => void
): Pick<BoardProps, "moves" | "events"> {

    const doAction = (action: (md: ServerMatchData) => void) => {
        setMatchData(doMatchAction(matchData, action));
    };

    const events: BoardProps["events"] = {
        endTurn: () => {
            doAction(md => {
                (new ServerCtx(md.ctxData)).endTurn();
            });
        },
        endMatch: () => {
            doAction(md => {
                (new ServerCtx(md.ctxData)).endMatch();
            });
        },
    };
     
    const moves: BoardProps["moves"] = {};
    for (const moveName in game.moves) {
        moves[moveName] = (arg: unknown) => {
            doAction(md => {
                matchMove(game, moveName, random, playerID, md, arg);
            });
        };
    }

    return { moves, events };
}