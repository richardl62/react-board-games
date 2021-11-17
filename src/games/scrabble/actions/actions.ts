import { Dispatch, useReducer } from "react";
import { GeneralGameProps } from "shared/general-game-props";
import { ScrabbleConfig } from "../config";
import { GlobalGameState } from "./global-game-state";
import { ActionType, gameDataReducer, getLocalGameState, LocalGameData } from "./game-state-reducer";


export interface SquareID {
    row: number;
    col: number;
    boardID: string;
}

export class Actions {
    constructor(
        generalProps: GeneralGameProps<GlobalGameState>, 
        config: ScrabbleConfig,
        gameState: LocalGameData,
        dispatch: Dispatch<ActionType>,
    ) {
        this.generalProps = generalProps;
        this.config = config;
        this.gameState = gameState,
        this.dispatch = dispatch;
    }

    // Clients should not access the game data, i.e. bgioProps.G
    readonly generalProps: GeneralGameProps<GlobalGameState>;

    readonly config: ScrabbleConfig;
    readonly dispatch:  Dispatch<ActionType>

    readonly gameState: LocalGameData;
}


export function useActions(props: GeneralGameProps<GlobalGameState>, config: ScrabbleConfig): Actions {
    
    const [state, dispatch] = useReducer(gameDataReducer, props, getLocalGameState );

    if (props.G.timestamp !== state.externalTimestamp) {
        dispatch({
            type: "externalStateChange",
            data: getLocalGameState(props),
        });
    } 

    return new Actions(
        props,
        config,
        state,
        dispatch,
    );
}
