import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { BoardProps } from "../../../app-game-support/board-props";
import { ClientMoves } from "@game-control/games/ticker/moves/moves";
import { ServerData } from "@game-control/games/ticker/server-data";

type TypedGameProps = BoardProps<ServerData, ClientMoves>;

export function useMatchState() : TypedGameProps {
    return useStandardBoardContext() as TypedGameProps;
}

