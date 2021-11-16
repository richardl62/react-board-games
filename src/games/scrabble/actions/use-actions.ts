import { useReducer, useState } from "react";
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
    const bgioTimestamp = props.G.timestamp;

    const [state, dispatch] = useReducer(reducer, stateFromBgio );
    const [lastBgioTimestamp, setLastBgioTimestamp] = useState(bgioTimestamp);

    if(bgioTimestamp !== lastBgioTimestamp) {
        sAssert(bgioTimestamp > lastBgioTimestamp);

        // Note to self: At one point, the timestamp was reduced useRef rather that useState. 
        // But then a change in bgio state did not cause a (visible) re-render. I didn't
        // understand why not.
        setLastBgioTimestamp(bgioTimestamp);

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
