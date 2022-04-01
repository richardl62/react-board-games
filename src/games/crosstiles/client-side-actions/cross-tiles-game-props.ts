import { WrappedGameProps } from "../../../app-game-support";
import { ServerData } from "../server-side/server-data";
import { ClientMoves } from "../server-side/moves";

export type CrossTilesGameProps = WrappedGameProps<ServerData, ClientMoves>;

