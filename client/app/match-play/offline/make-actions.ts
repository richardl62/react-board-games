import { AppGame, BoardProps } from "@/app-game-support";
import { MoveArg0 } from "@shared/game-control/move-fn";
import { RequiredServerData } from "@shared/game-control/required-server-data";
import { matchMove } from "@shared/game-control/match-move";
import { ServerMatchData } from "@shared/server-match-data";
import { Ctx, ServerCtx } from "@shared/game-control/ctx";
import { RandomAPI } from "@shared/utils/random-api";

export function makeActions(
    game: AppGame, 
    playerID: string,
    random: RandomAPI,
    matchData: ServerMatchData, 
    setMatchData: (arg: ServerMatchData) => void
): Pick<BoardProps, "moves" | "events"> {

    const executeWithErrorHandling = (action: (md: ServerMatchData) => void) => {
        try {
            const md = structuredClone(matchData);
            action(md);
            md.moveError = null;
            setMatchData(md);
        } catch (e) {
            const md = structuredClone(matchData);
            const errorMessage =
                e instanceof Error
                    ? e.message
                    : "Execution failed: " + String(e);
            md.moveError = errorMessage;
            setMatchData(md);
        }
    };

    const events: BoardProps["events"] = {
        endTurn: () => {
            executeWithErrorHandling(md => {
                const ctx = new ServerCtx(md.ctxData);
                ctx.endTurn();
                md.ctxData = ctx.data;
            });
        },
        endMatch: () => {
            executeWithErrorHandling(md => {
                const ctx = new ServerCtx(md.ctxData);
                ctx.endMatch();
                md.ctxData = ctx.data;
            });
        },
    };
     
    
    const moves: BoardProps["moves"] = {};
    for (const moveName in game.moves) {
        moves[moveName] = (arg: unknown) => {
            executeWithErrorHandling(md => {
                const moveArg0: MoveArg0<RequiredServerData> = {
                    G: md.state,
                    ctx: new Ctx(md.ctxData),
                    playerID: playerID,
                    random: random,
                    events,
                };
                matchMove(game, moveName, moveArg0, arg);
            });
        };
    }

    return { moves, events };
}