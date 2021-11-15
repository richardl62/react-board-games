import { useReducer, useRef } from "react";
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
    };
}

function reducer(state : GameState, action: ActionType) : GameState {

    if(action.type === "bgioStateChange") {
        return action.data;
    }

    const br = new BoardAndRack(state.board, state.rack);
    let bag = state.bag;

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
        board: br.getBoard(),
        rack: br.getRack(),
        bag: bag,
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useActions(props: GeneralGameProps<GameData>, config: ScrabbleConfig): Actions | null {
    
    const stateFromBgio = getGameState(props);
    const bgioTimestamp = props.G.timestamp;

    const [state, dispatch] = useReducer(reducer, stateFromBgio );
    const lastBgioTimestamp = useRef(bgioTimestamp);
    const callCount = useRef(0);
    callCount.current++;

    if(bgioTimestamp !== lastBgioTimestamp.current) {
        sAssert(bgioTimestamp > lastBgioTimestamp.current);
        lastBgioTimestamp.current = bgioTimestamp;

        dispatch({ 
            type: "bgioStateChange", 
            data: stateFromBgio,
        });

    }


    // const rackLettersState = gameState.rack.map(ct => ct && ct.letter);
    // const rackLettersBgio = stateFromBgio.gameState.rack.map(ct => ct && ct.letter);
    // console.log(`useActions(${callCount.current})`
    //     `state(${state.bgioTimestamp}): `, ...rackLettersState,
    //     `bgio(${props.G.timestamp}): `, ...rackLettersBgio,
    // );

    

    // if(state.rack[0] === null && state.rack[1] === null) {
    //     console.log("Found double null at start of rack: call count", callCount.current );
    // }
    return new Actions(
        props,
        config,
        state,
        dispatch,
    );
}
