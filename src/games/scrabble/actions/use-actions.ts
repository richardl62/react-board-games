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
        bgioTimestamp: props.G.timestamp,
    };
}

function reducer(state : GameState, action: ActionType) : GameState {

    if(action.type === "noop") {
        return state;
    }

    if(action.type === "bgioStateChange") {
        const currentBgioState = action.data;

        sAssert(currentBgioState.bgioTimestamp > state.bgioTimestamp);
        return currentBgioState;
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

export function useActions(props: GeneralGameProps<GameData>, config: ScrabbleConfig): Actions | null {
    
    const stateFromBgio = getGameState(props);
    const [state, dispatch] = useReducer(reducer, stateFromBgio );

    const bgioTimestamp = props.G.timestamp;

    if (bgioTimestamp !== state.bgioTimestamp) {
        dispatch({
            type: "bgioStateChange",
            data: stateFromBgio,
        });
    } 

    return new Actions(
        props,
        config,
        state,
        dispatch,
    );
}
