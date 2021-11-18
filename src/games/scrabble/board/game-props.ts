import { Dispatch } from "react";
import { BgioGameProps } from "shared/bgio-game-props";
import { GlobalGameState } from "../actions/global-game-state";
import { LocalGameState } from "../actions/local-game-state";
import { ActionType } from "../actions/local-game-state-reducer";
import { ScrabbleConfig } from "../config";

export interface GameProps { // To do - think of better name
    // Clients should not access the game data, i.e. bgioProps.G
    readonly bgioProps: BgioGameProps<GlobalGameState>,

    readonly config: ScrabbleConfig;
    readonly dispatch:  Dispatch<ActionType>

    readonly localState: LocalGameState;
}
