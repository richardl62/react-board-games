import { useReducer, useRef } from "react";
import { sAssert } from "shared/assert";
import { GeneralGameProps } from "shared/general-game-props";
import { Actions, GameState } from "./actions";
import { ScrabbleConfig } from "../config";
import { ActionType } from "./actions";
import { BoardAndRack } from "./board-and-rack";
import { GameData } from "./game-data";


interface ReducerState {
    gameState?: GameState,
    bgioTimestamp: number;
} 

function getReducerState(props: GeneralGameProps<GameData>): ReducerState {
    const playerID = props.playerID;
    sAssert(playerID); // KLUDGE? - Not sure when it can be null.

    return {
        gameState: {
            board: props.G.board,
            rack: props.G.playerData[playerID].playableTiles,
            bag: props.G.bag,
        },
        bgioTimestamp: props.G.timestamp,
    };
}

// | { type: "setBlank", data: {id: SquareID, letter: Letter}}
// | { type: "swapTiles", data: boolean[] }

function reducer(state : ReducerState, action: ActionType) : ReducerState {

    if(action.type === "bgioStateChangePending") {
        return {
            bgioTimestamp: state.bgioTimestamp,
        };
    }

    if(action.type === "bgioStateChange") {
        const newState = getReducerState(action.data);
        return newState;
    }

    sAssert(state.gameState, "Move made while state undefined (most likely bgio move is pending)");
        
    const br = new BoardAndRack(state.gameState.board, state.gameState.rack);
    let bag = state.gameState.bag;

    if(action.type === "move") {
        br.move(action.data);
    } else if(action.type === "recallRack") {
        br.recallRack();
    } else if(action.type === "shuffleRack") {
        br.shuffleRack();
    } else if(action.type === "swapTiles") {
        bag = [...bag];
        br.swapTiles(action.data, bag);
    } else if(action.type === "setBlank") {
        br.setBlack(action.data.id, action.data.letter);
    } else {
        console.warn("Unrecognised action in reducer:", action);
    }
    return {
        gameState: {
            board: br.getBoard(),
            rack: br.getRack(),
            bag: bag,
        },
        bgioTimestamp: state.bgioTimestamp,
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useActions(props: GeneralGameProps<GameData>, config: ScrabbleConfig): Actions | null {
    
    const stateFromBgio = getReducerState(props);
    const [state, dispatch] = useReducer(reducer, stateFromBgio );

    const callCount = useRef(0);
    callCount.current++;

    const gameState = state.gameState;
    if(!gameState) {
        return null;
    }

    // const rackLettersState = gameState.rack.map(ct => ct && ct.letter);
    // const rackLettersBgio = stateFromBgio.gameState.rack.map(ct => ct && ct.letter);
    // console.log(`useActions(${callCount.current})`,
    //     `state(${state.bgioTimestamp}): `, ...rackLettersState,
    //     `bgio(${props.G.timestamp}): `, ...rackLettersBgio,
    // );
    
    if(state.bgioTimestamp !== props.G.timestamp) {
        sAssert(state.bgioTimestamp < props.G.timestamp);
        
        dispatch({ 
            type: "bgioStateChange", 
            data: props,
        });

        return null;
    }

    // if(state.rack[0] === null && state.rack[1] === null) {
    //     console.log("Found double null at start of rack: call count", callCount.current );
    // }
    return new Actions(
        props,
        config,
        gameState,
        dispatch,
    );
}
