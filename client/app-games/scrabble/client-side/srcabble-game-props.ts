import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ServerData } from "@game-control/games/scrabble/server-data";
import { ClientMoves } from "@game-control/games/scrabble/moves/moves";

export type ScrabbleGameProps = WrappedGameProps<ServerData, ClientMoves>;

