import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ServerData } from "../game-control/server-data";
import { ClientMoves } from "../game-control/moves";
import { WrappedServerData, makeWrappedServerData } from "../game-control/wrapped-server-data";

export interface GameContext extends WrappedGameProps<ServerData, ClientMoves>  {
    G: WrappedServerData;
}
export function useGameContext() : GameContext {
    const ctx = useStandardBoardContext() as WrappedGameProps<ServerData, ClientMoves>;
    return {
        ...ctx,
        G: makeWrappedServerData(ctx.G),
    };
}
