import { AppGame, BoardProps } from "@/app-game-support";
import { MoveArg0 } from "@shared/game-control/move-fn";
import { RequiredServerData } from "@shared/game-control/required-server-data";
import { matchMove } from "@shared/game-control/match-move";

export interface MoveResult {
    G: RequiredServerData; // KLUDGE? Will contain more than this.
    moveError: string | null;
}

export function wrappedMoves(
    game: AppGame, 
    moveArg0: MoveArg0<RequiredServerData>,
    setMoveResult: (arg: MoveResult) => void,
) : BoardProps["moves"] {

    const wrapped: BoardProps["moves"] = {};

    for (const moveName in game.moves) {
        wrapped[moveName] = (arg: unknown) => {
            const newG = JSON.parse(JSON.stringify(moveArg0.G));
            const newArg0: MoveArg0<RequiredServerData> = { ...moveArg0, G: newG };
            let moveError: string | null = null;
            try {
                matchMove(game, moveName, newArg0, arg);
            } catch (e) {
                if (e instanceof Error) {
                    moveError = e.message;
                } else {
                    moveError = "Unknown error";
                }
            }

            setMoveResult({ G: newG, moveError });
        };
    }

    return wrapped;
}
