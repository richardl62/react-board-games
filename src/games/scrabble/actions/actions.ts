import { Dispatch, useReducer } from "react";
import { sAssert } from "shared/assert";
import { GeneralGameProps } from "shared/general-game-props";
import { ScrabbleConfig } from "../config";
import { GameData } from "./game-data";
import { ActionType, GameState, gameStateReducer, getGameState } from "./game-state-reducer";

export interface SquareID {
    row: number;
    col: number;
    boardID: string;
}

export class Actions {
    constructor(
        generalProps: GeneralGameProps<GameData>, 
        config: ScrabbleConfig,
        gameState: GameState,
        dispatch: Dispatch<ActionType>,
    ) {
        this.generalProps = generalProps;
        this.config = config;
        this.gameState = gameState,
        this.dispatch = dispatch;
    }

    // Clients should not access the game data, i.e. bgioProps.G
    readonly generalProps: GeneralGameProps<GameData>;

    readonly config: ScrabbleConfig;
    readonly dispatch:  Dispatch<ActionType>

    readonly gameState: GameState;
    
    score(pid: string) : number {
        const playerData = this.generalProps.G.playerData[pid];
        sAssert(playerData);
        return playerData.score;
    }
}


export function useActions(props: GeneralGameProps<GameData>, config: ScrabbleConfig): Actions {
    
    const [state, dispatch] = useReducer(gameStateReducer, props, getGameState );

    if (props.G.timestamp !== state.externalTimestamp) {
        dispatch({
            type: "externalStateChange",
            data: getGameState(props),
        });
    } 

    return new Actions(
        props,
        config,
        state,
        dispatch,
    );
}
