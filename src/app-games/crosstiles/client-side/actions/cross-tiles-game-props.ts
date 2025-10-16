import { ServerData } from "@game-control/games/crosstiles/server-data";
import { ClientMoves } from "@game-control/games/crosstiles/moves/moves";
import { WrappedGameProps } from "../../../../app-game-support/wrapped-game-props";

export type CrossTilesGameProps = WrappedGameProps<ServerData, ClientMoves>;

