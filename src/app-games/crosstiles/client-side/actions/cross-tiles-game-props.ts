import { ServerData } from "../../../../game-controlX/games/crosstiles/server-data";
import { ClientMoves } from "../../../../game-controlX/games/crosstiles/moves/moves";
import { WrappedGameProps } from "../../../../app-game-support/wrapped-game-props";

export type CrossTilesGameProps = WrappedGameProps<ServerData, ClientMoves>;

