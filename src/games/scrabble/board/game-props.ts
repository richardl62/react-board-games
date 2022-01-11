import { WrappedGameProps } from "../../../bgio";
import { GeneralGameState } from "../global-actions";
import { ClientMoves } from "../global-actions/bgio-moves";

export type ScabbbleGameProps = WrappedGameProps<GeneralGameState, ClientMoves>;

