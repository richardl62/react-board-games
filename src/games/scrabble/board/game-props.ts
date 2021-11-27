import { Dispatch } from "react";
import { BgioGameProps } from "../../../bgio/bgio-game-props";
import { LocalGameState } from "../actions/local-game-state";
import { ActionType } from "../actions/local-game-state-reducer";
import { ScrabbleConfig } from "../config";

export interface GameProps extends LocalGameState {
    readonly bgioProps: BgioGameProps,
    readonly config: ScrabbleConfig;
    readonly dispatch:  Dispatch<ActionType>
}
