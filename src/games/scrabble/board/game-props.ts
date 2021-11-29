import { Dispatch } from "react";
import { WrappedGameProps } from "../../../bgio";
import { LocalGameState } from "../actions/local-game-state";
import { ActionType } from "../actions/local-game-state-reducer";
import { ScrabbleConfig } from "../config";

export interface GameProps extends LocalGameState {
    readonly bgioProps: WrappedGameProps,
    readonly config: ScrabbleConfig;
    readonly dispatch:  Dispatch<ActionType>
}
