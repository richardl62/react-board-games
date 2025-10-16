import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ClientMoves } from "../../../game-controlX/games/ticker/moves/moves";
import { ServerData } from "../../../game-controlX/games/ticker/server-data";

type TypedGameProps = WrappedGameProps<ServerData, ClientMoves>;

export function useGameContext() : TypedGameProps {
    return useStandardBoardContext() as TypedGameProps;
}

