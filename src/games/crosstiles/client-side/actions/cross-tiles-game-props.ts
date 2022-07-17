import { ServerData } from "../../server-side/server-data";
import { ClientMoves } from "../../server-side/moves";
import { WrappedGameProps } from "../../../../app-game-support/wrapped-game-props";

export type CrossTilesGameProps = WrappedGameProps<ServerData, ClientMoves>;

