import { AppGame, BoardProps } from "@/app-game-support";
import { SharedOfflineBoardData } from "./shared-offline-board-data";

export function wrappedMoves(game: AppGame, sharedProps: SharedOfflineBoardData, id: number) : BoardProps["moves"] {
    const {moves: unwrapped} = game;
    const {ctx, events, G, setG, random} = sharedProps;

    const wrapped: BoardProps["moves"] = {};

    for (const moveName in unwrapped) {
        wrapped[moveName] = (arg: unknown) => {
            const newG = JSON.parse(JSON.stringify(G));
            const moveFn = unwrapped[moveName];
            moveFn({
                G: newG,
                ctx,
                playerID: id.toString(),
                random,
                events,
            }, arg);
            
            setG(newG);
        };
    }

    return wrapped;
}
