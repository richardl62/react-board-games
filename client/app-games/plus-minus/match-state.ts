import { useStandardBoardContext } from "@/app-game-support/standard-board";
import { WrappedMatchProps } from "@/app-game-support/wrapped-match-props";
import { ClientMoves } from "@game-control/games/plus-minus/moves";
import { ServerData } from "@game-control/games/plus-minus/server-data";

type TypedGameProps = WrappedMatchProps<ServerData, ClientMoves>;

export function useMatchState() : TypedGameProps {
    return useStandardBoardContext() as TypedGameProps;
}

