import { useStandardBoardContext } from "../../../app-game-support/make-standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ClientMoves } from "../server-side/moves";
import { ServerData } from "../server-side/server-data";

type BasicsGameProps = WrappedGameProps<ServerData, ClientMoves>;

export function useBasicsContext() : BasicsGameProps {
    return useStandardBoardContext() as BasicsGameProps;
}

