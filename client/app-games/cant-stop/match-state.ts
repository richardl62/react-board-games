import { useStandardBoardContext } from "@/app-game-support/standard-board";
import { WrappedMatchProps } from "@/app-game-support/wrapped-match-props";
import { ClientMoves } from "@shared/game-control/games/cant-stop/moves/moves";
import { ServerData } from "@game-control/games/cant-stop/server-data";

type TypedGameProps = WrappedMatchProps<ServerData, ClientMoves>;

export function useMatchState() : TypedGameProps {
    return useStandardBoardContext() as TypedGameProps;
}
