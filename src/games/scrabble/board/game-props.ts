import { WrappedGameProps } from "../../../bgio";
import { GeneralGameState } from "../actions";
import { ClientMoves } from "../actions/bgio-moves";

export type ScabbbleGameProps = WrappedGameProps<GeneralGameState, ClientMoves>;

