import { WrappedGameProps } from "../../../app-game-support";
import { ServerData } from "../global-actions";
import { ClientMoves } from "../global-actions/bgio-moves";

export type ScrabbleGameProps = WrappedGameProps<ServerData, ClientMoves>;

