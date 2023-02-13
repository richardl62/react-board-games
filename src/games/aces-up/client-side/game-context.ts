import { useStandardBoardContext } from "../../../app-game-support/make-standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ClientMoves } from "../game-control/moves";
import { ServerData } from "../game-control/server-data";

type TypedGameProps = WrappedGameProps<ServerData, ClientMoves>;

export function useGameContext() : TypedGameProps {
    return useStandardBoardContext() as TypedGameProps;
}

