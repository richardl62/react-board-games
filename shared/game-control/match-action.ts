import { MutableMatchData } from "../server-match-data.js";
import { RandomAPI } from "../utils/random-api.js";
import { Ctx, endMatch, endTurn } from "./ctx.js";
import { AllActive, GameControl } from "./game-control.js";
import { MoveArg0 } from "./move-fn.js";

/**
 * Call a Game's move function or throw an error if a problem is found.
 * The input matchData is not modified, and new matchData is returned
 * (this helps avoid leaving invalid match data when errors occur).
 */
export function matchMove<Param>(
    GameControl: GameControl,
    moveName: string,
    random: RandomAPI,
    playerID: string,
    matchData: MutableMatchData,
    param: Param
) : MutableMatchData {
    const { state, ctxData } = structuredClone(matchData);
    
    const ctx = new Ctx(ctxData);
    const arg0: MoveArg0<unknown> = {
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

    func(arg0, param);

    return {state, ctxData}
}

