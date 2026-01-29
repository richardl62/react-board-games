import { BoardProps } from "../../../app-game-support/board-props";
import { ServerData } from "@game-control/games/scrabble/server-data";
import { ClientMoves } from "@game-control/games/scrabble/moves/moves";

export type ScrabbleGameProps = BoardProps<ServerData, ClientMoves>;

