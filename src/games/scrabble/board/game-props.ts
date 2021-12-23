import { Dispatch } from "react";
import { WrappedGameProps } from "../../../bgio";
import { GeneralGameState } from "../actions";
import { ClientMoves } from "../actions/bgio-moves";
import { LocalGameState } from "../actions/local-game-state";
import { ActionType } from "../actions/local-game-state-reducer";
import { ScrabbleConfig } from "../config";

export type ScabbbleGameProps = WrappedGameProps<GeneralGameState, ClientMoves>;

export interface GameProps extends LocalGameState {
    readonly bgioProps: ScabbbleGameProps,
    readonly config: ScrabbleConfig;
    readonly dispatch:  Dispatch<ActionType>
}
