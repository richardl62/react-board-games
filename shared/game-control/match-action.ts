import { MutableMatchData } from "../server-match-data.js";
import { RandomAPI } from "../utils/random-api.js";
import { Ctx, endMatch, endTurn } from "./ctx.js";
import { AllActive, GameControl } from "./game-control.js";
import { MoveArg0 } from "./move-fn.js";

/**
 * Call a Game's move function, or throw if there is a problem.
 * 
 * No input is modified except, possibly, random. (I could do better at
 * policing this.) Instead a (potentially) modified copy of matchData 
 * is returned.
 */
export function matchMove<Param>(
    GameControl: Readonly<GameControl>,
    moveName: string,
    random: RandomAPI, // Can be changed
    playerID: string,
    matchData: Readonly<MutableMatchData>,
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

