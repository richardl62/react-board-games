import { useReducer } from "react";
import { sAssert } from "shared/assert";
import { GeneralGameProps } from "shared/general-game-props";
import { Actions, GameState } from "./actions";
import { ScrabbleConfig } from "../config";
import { ActionType } from "./actions";
import { BoardAndRack } from "./board-and-rack";
import { GameData } from "./game-data";

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

function reducer(state : GameState, action: ActionType) : GameState {

    if(action.type === "externalStateChange") {
        const externalState = action.data;

        sAssert(externalState.externalTimestamp > state.externalTimestamp);
        return externalState;
    }

    const br = new BoardAndRack(state.board, state.rack);

    if(action.type === "move") {
        br.move(action.data);
    } else if(action.type === "recallRack") {
        br.recallRack();
    } else if(action.type === "shuffleRack") {
        br.shuffleRack();
    } else if(action.type === "setBlank") {
        br.setBlack(action.data.id, action.data.letter);
    } else {
        console.warn("Unrecognised action in reducer:", action);
    }
    
    return {
        ...state,
        board: br.getBoard(),
        rack: br.getRack(),
    };
}

export function useActions(props: GeneralGameProps<GameData>, config: ScrabbleConfig): Actions {
    
    const [state, dispatch] = useReducer(reducer, props, getGameState );

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
