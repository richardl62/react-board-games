import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ServerData } from "../server-side";
import { ClientMoves } from "../server-side/moves";

export type ScrabbleGameProps = WrappedGameProps<ServerData, ClientMoves>;

