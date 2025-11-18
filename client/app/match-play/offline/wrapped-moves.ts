import { AppGame, BoardProps } from "@/app-game-support";
import { MoveArg0 } from "@shared/game-control/move-fn";
import { RequiredServerData } from "@shared/game-control/required-server-data";
import { matchMove } from "@shared/game-control/match-move";

export function wrappedMoves(
    game: AppGame, 
    moveArg0: MoveArg0<unknown>,
    setG: (arg: RequiredServerData) => void,
) : BoardProps["moves"] {

    const wrapped: BoardProps["moves"] = {};

    for (const moveName in game.moves) {
        wrapped[moveName] = (arg: unknown) => {
            const newG = JSON.parse(JSON.stringify(moveArg0.G));
            const newArg0 = { ...moveArg0, G: newG} as MoveArg0<RequiredServerData>;
            matchMove(game.moves[moveName], newArg0, arg);

            setG(newG);
        };
    }

    return wrapped;
}
