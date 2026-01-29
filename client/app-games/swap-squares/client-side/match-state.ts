import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { BoardProps } from "../../../app-game-support/board-props";
import { ClientMoves } from "@game-control/games/swap-squares/moves/moves";
import { ServerData } from "@game-control/games/swap-squares/server-data";

type TypedGameProps = BoardProps<ServerData, ClientMoves>;

export function useMatchState() : TypedGameProps {
    return useStandardBoardContext() as TypedGameProps;
}

