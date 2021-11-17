import { Dispatch, useReducer } from "react";
import { BgioGameProps } from "shared/bgio-game-props";
import { ScrabbleConfig } from "../config";
import { GlobalGameState } from "./global-game-state";
import { ActionType, localGameStateReducer } from "./local-game-state-reducer";
import { LocalGameState, getLocalGameState } from "./local-game-state";

export interface Actions {
    // Clients should not access the game data, i.e. bgioProps.G
    readonly bgioProps: BgioGameProps<GlobalGameState>,

    readonly config: ScrabbleConfig;
    readonly dispatch:  Dispatch<ActionType>

    readonly localState: LocalGameState;
}


export function useActions(props: BgioGameProps<GlobalGameState>, config: ScrabbleConfig): Actions {
    
    const [state, dispatch] = useReducer(localGameStateReducer, props, getLocalGameState );

    if (props.G.timestamp !== state.externalTimestamp) {
        dispatch({
            type: "externalStateChange",
            data: getLocalGameState(props),
        });
    } 

    return {
        bgioProps: props,
        config: config,
        dispatch: dispatch,
        localState: state,
    };
}
