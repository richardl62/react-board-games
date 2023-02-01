import { useStandardBoardContext } from "../../../app-game-support/make-standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ClientMoves } from "../server-side/moves";
import { ServerData } from "../server-side/server-data";

type PlusMinusGameProps = WrappedGameProps<ServerData, ClientMoves>;

export function usePlusMinusContext() : PlusMinusGameProps {
    return useStandardBoardContext() as PlusMinusGameProps;
}

