import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ClientMoves } from "@/game-controlX/games/plus-minus/moves";
import { ServerData } from "@/game-controlX/games/plus-minus/server-data";

type TypedGameProps = WrappedGameProps<ServerData, ClientMoves>;

export function useGameContext() : TypedGameProps {
    return useStandardBoardContext() as TypedGameProps;
}

