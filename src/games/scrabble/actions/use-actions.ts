import { useReducer, useRef } from "react";
import { sAssert } from "shared/assert";
import { GeneralGameProps } from "shared/general-game-props";
import { Actions } from ".";
import { ScrabbleConfig } from "../config";
import { ActionType } from "./actions";
import { Rack } from "./board-and-rack";
import { BoardData, GameData } from "./game-data";

interface ReducerState  {
    board: BoardData,
    rack: Rack,
    bgioTimestamp: number;
}

function getState(props: GeneralGameProps<GameData>) : ReducerState {
    const playerID = props.playerID;
    sAssert(playerID); // KLUDGE? - Not sure when it can be null.

    return {
        board: props.G.board,
        rack: props.G.playerData[playerID].playableTiles,
        bgioTimestamp: props.G.timestamp,
    };
}

function reducer(state : ReducerState, action: ActionType) : ReducerState {

    let newState: ReducerState;
    if(action.type === "bgioStateChange") {
        newState = getState(action.data);
    } else {
        console.warn(`Unrecognised action "${action.type}" in reducer`);
        newState = state;
    }

    return newState;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useActions(props: GeneralGameProps<GameData>, config: ScrabbleConfig): Actions | null {
    
    const stateFromBgio = getState(props);
    const [state, dispatch] = useReducer(reducer, stateFromBgio );

    const callCount = useRef(0);
    callCount.current++;

    const rackLettersState = state.rack.map(ct => ct && ct.letter);
    const rackLettersBgio = stateFromBgio.rack.map(ct => ct && ct.letter);
    console.log(`useActions(${callCount.current})`,
        `state(${state.bgioTimestamp}): `, ...rackLettersState,
        `bgio(${props.G.timestamp}): `, ...rackLettersBgio,
    );
    
    if(state.bgioTimestamp !== props.G.timestamp) {
        sAssert(state.bgioTimestamp < props.G.timestamp);
        
        dispatch({ 
            type: "bgioStateChange", 
            data: props,
        });

        return null;
    }

    if(state.rack[0] === null && state.rack[1] === null) {
        console.log("Found double null at start of rack: call count", callCount.current );
    }
    return new Actions(
        props,
        config,
        state.board,
        state.rack,
        props.G.bag.length,
        dispatch,
    );
}
