import { RequiredServerData } from "./required-server-data.js";
import { MoveArg0 } from "./move-fn.js";
import { AllActive, GameControl } from "./game-control.js";

/**
 * Call a Game's move function in a manner that is suitable for a match.
 * Specifically, catch errors and increment the move count.
 */
export function matchMove<State extends RequiredServerData, Param>(
    GameControl: GameControl,
    moveName: string,
    arg0: MoveArg0<State>, 
    param: Param
) {
    let errorMessage = null;

    const { G, ctx: {currentPlayer, matchover}  } = arg0;
    const { playerID } = arg0;
    
    try {
        const func = GameControl.moves[moveName];
        if (!func) {
            throw new Error(`Move "${moveName}" not found in game ${GameControl.name}`);
        }

        if ( matchover) {
            throw new Error("Move attempted after match is over.");
        }

        if (currentPlayer !== playerID && GameControl.turnOrder !== AllActive) {
            throw new Error(`It is not player ${playerID}'s turn.`);
        }

        const result = func(arg0, param);
        if (result !== undefined) {
            throw new Error("Move functions should not return a value.");
        }
    } catch (error) {
        errorMessage = error instanceof Error ? error.message :
            "unknown error";
    }

    G.moveCount++;
    G.moveError = errorMessage;
}


