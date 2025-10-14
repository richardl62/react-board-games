import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ClientMoves } from "../server-side/moves";
import { ServerData } from "../server-side/server-data";

type TypedGameProps = WrappedGameProps<ServerData, ClientMoves>;

export function useGameContext() : TypedGameProps {
    return useStandardBoardContext() as TypedGameProps;
}

