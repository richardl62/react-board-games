import { AppGame, BoardProps } from "@/app-game-support";
import { MoveArg0 } from "@shared/game-control/move-fn";
import { RequiredServerData } from "@shared/game-control/required-server-data";

export function wrappedMoves(
    game: AppGame, 
    moveArg0: MoveArg0<unknown>,
    setG: (arg: RequiredServerData) => void,
) : BoardProps["moves"] {

    const wrapped: BoardProps["moves"] = {};

    for (const moveName in game.moves) {
        wrapped[moveName] = (arg: unknown) => {
            const newG = JSON.parse(JSON.stringify(moveArg0.G));
            game.moves[moveName]({...moveArg0, G: newG}, arg);
            setG(newG);
        };
    }

    return wrapped;
}
