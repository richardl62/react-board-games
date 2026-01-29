import { ServerData } from "@game-control/games/crosstiles/server-data";
import { ClientMoves } from "@game-control/games/crosstiles/moves/moves";
import { BoardProps } from "../../../../app-game-support/board-props";

export type CrossTilesGameProps = BoardProps<ServerData, ClientMoves>;

