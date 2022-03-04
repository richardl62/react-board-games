import React, { useReducer} from "react";
import { ReactCribbageContext } from "./cribbage-context";
import { Cribbage } from "./board/game";
import { startingState } from "./actions/game-state";
import { reducer } from "./actions/reducer";
import { DndProvider } from "../../utils/board/drag-drop";

export function GameWrapper(): JSX.Element {
    const [state, dispatch] = useReducer(reducer, startingState);

    const context = {...state,
        dispatch: dispatch,
    };
    return <ReactCribbageContext.Provider value={context}>
        
        <DndProvider>
            <Cribbage />
        </DndProvider>

    </ReactCribbageContext.Provider>;
}