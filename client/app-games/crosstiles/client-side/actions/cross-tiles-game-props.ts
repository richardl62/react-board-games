import { ServerData } from "@game-control/games/crosstiles/server-data";
import { ClientMoves } from "@game-control/games/crosstiles/moves/moves";
import { WrappedMatchProps } from "../../../../app-game-support/wrapped-match-props";

export type CrossTilesGameProps = WrappedMatchProps<ServerData, ClientMoves>;

