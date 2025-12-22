import { ServerMatchData } from "../server-match-data.js";
import { RandomAPI } from "../utils/random-api.js";
import { Ctx, endMatch, endTurn } from "./ctx.js";
import { AllActive, GameControl } from "./game-control.js";
import { MoveArg0 } from "./move-fn.js";
import { RequiredServerData } from "./required-server-data.js";

/**
 * Call a Game's move function in a manner that is suitable for a match.
 * Specifically, detect errors and increment the move count. (Indend for
 * use within doMatchAction().)
 */
export function matchMove<Param>(
    GameControl: GameControl,
    moveName: string,
    random: RandomAPI,
    playerID: string,
    matchData: Omit<ServerMatchData, "playerData">,
    param: Param
) {
    const { state, ctxData } = matchData;
    
    const ctx = new Ctx(ctxData);
    const arg0: MoveArg0<RequiredServerData> = {
        G: state,
        ctx,
        playerID,
        random,
        events: {
            endTurn: () => endTurn(ctxData),
            endMatch: () => endMatch(ctxData),
        }
    };

    const func = GameControl.moves[moveName];
    if (!func) {
        throw new Error(`Move "${moveName}" not found in game ${GameControl.name}`);
    }

    if (ctx.matchover) {
        throw new Error("Move attempted after match is over.");
    }

    if (ctx.currentPlayer !== playerID && GameControl.turnOrder !== AllActive) {
        throw new Error(`It is not player ${playerID}'s turn.`);
    }

    const result = func(arg0, param);
    if (result !== undefined) {
        throw new Error("Move functions should not return a value.");
    }

    state.moveCount++;
}

// Wrap an action on match data with error handling,
// and set moveError appropriately.
export function doMatchAction<T extends { moveError: string | null }>(
    matchData: T,
    action: (md: T) => void
) : T 
{
    try {
        const md = structuredClone(matchData);
        action(md);
        md.moveError = null;
        return md;
    } catch (e) {
        const md = structuredClone(matchData);
        const errorMessage =
            e instanceof Error
                ? e.message
                : "Execution failed: " + String(e);
        md.moveError = errorMessage;
        return md;
    }
}

