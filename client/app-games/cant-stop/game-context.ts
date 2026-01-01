import { useStandardBoardContext } from "@/app-game-support/standard-board";
import { WrappedGameProps } from "@/app-game-support/wrapped-game-props";
import { ClientMoves } from "@shared/game-control/games/cant-stop/moves/moves";
import { ServerData } from "@game-control/games/cant-stop/server-data";

type TypedGameProps = WrappedGameProps<ServerData, ClientMoves>;

export function useGameContext() : TypedGameProps {
    return useStandardBoardContext() as TypedGameProps;
}
