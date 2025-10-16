import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { ServerData } from "../../../game-controlX/games/scrabble/moves";
import { ClientMoves } from "../../../game-controlX/games/scrabble/moves/moves";

export type ScrabbleGameProps = WrappedGameProps<ServerData, ClientMoves>;

