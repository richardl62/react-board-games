import { useStandardBoardContext } from "@/app-game-support/standard-board";
import { WrappedGameProps } from "@/app-game-support/wrapped-game-props";
import { ClientMoves } from "@game-control/games/random-draw/moves";
import { ServerData } from "@game-control/games/random-draw/server-data";

type TypedGameProps = WrappedGameProps<ServerData, ClientMoves>;

export function useMatchState() : TypedGameProps {
    return useStandardBoardContext() as TypedGameProps;
}

