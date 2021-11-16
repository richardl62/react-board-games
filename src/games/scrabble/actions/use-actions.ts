import { useReducer } from "react";
import { sAssert } from "shared/assert";
import { GeneralGameProps } from "shared/general-game-props";
import { ScrabbleConfig } from "../config";
import { Actions } from "./actions";
import { GameData } from "./game-data";
import { GameState, gameStateReducer } from "./game-state-reducer";

function getGameState(props: GeneralGameProps<GameData>): GameState {
    const playerID = props.playerID;
    sAssert(playerID); // KLUDGE? - Not sure when it can be null.

    return {
        board: props.G.board,
        rack: props.G.playerData[playerID].playableTiles,
        bag: props.G.bag,
        externalTimestamp: props.G.timestamp,
    };
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
