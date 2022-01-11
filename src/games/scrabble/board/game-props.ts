import { WrappedGameProps } from "../../../bgio";
import { GeneralGameState } from "../actions";
import { ClientMoves } from "../global-actions/bgio-moves";

export type ScabbbleGameProps = WrappedGameProps<GeneralGameState, ClientMoves>;

