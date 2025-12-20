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

    const events: BoardProps["events"] = {
        endTurn: () => {
            const md = structuredClone(matchData);
            
            const ctx = new ServerCtx(md.ctxData);
            ctx.endTurn();
            md.ctxData = ctx.data;
            
            setMatchData(md);
        },
        endMatch: () => {
            const md = structuredClone(matchData);
            
            const ctx = new ServerCtx(md.ctxData);
            ctx.endMatch();
            md.ctxData = ctx.data;
            
            setMatchData(md);
        },
    };
     
    
    const moves: BoardProps["moves"] = {};
    for (const moveName in game.moves) {

        moves[moveName] = (arg: unknown) => {
            try {
                const md = structuredClone(matchData);

                const moveArg0: MoveArg0<RequiredServerData> = {
                    G: md.state,
                    ctx: new Ctx(md.ctxData),
                    playerID: playerID,
                    random: random,
                    events,
                };
                matchMove(game, moveName, moveArg0, arg);

                setMatchData(md);
            } catch (e) {
                const md = structuredClone(matchData);

                const errorMessage =
                    e instanceof Error
                        ? e.message
                        : "Move execution failed: " + String(e);
                md.moveError = errorMessage;
                
                setMatchData(md);
            }
        };
    }

    return { moves, events };
}