import { WrappedMatchProps } from "../../../app-game-support/wrapped-match-props";
import { ServerData } from "@game-control/games/scrabble/server-data";
import { ClientMoves } from "@game-control/games/scrabble/moves/moves";

export type ScrabbleGameProps = WrappedMatchProps<ServerData, ClientMoves>;

