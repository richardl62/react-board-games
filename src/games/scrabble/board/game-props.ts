import { WrappedGameProps } from "../../../app-game-support";
import { GlobalGameState } from "../global-actions";
import { ClientMoves } from "../global-actions/bgio-moves";

export type ScabbbleGameProps = WrappedGameProps<GlobalGameState, ClientMoves>;

