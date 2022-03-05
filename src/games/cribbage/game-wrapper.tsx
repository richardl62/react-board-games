import React, { useReducer} from "react";
import { ReactCribbageContext } from "./cribbage-context";
import { Cribbage } from "./board/game";
import { startingState } from "./actions/game-state";
import { reducer } from "./actions/reducer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export function GameWrapper(): JSX.Element {
    const [state, dispatch] = useReducer(reducer, startingState);

    const context = {...state,
        dispatch: dispatch,
    };
    return <ReactCribbageContext.Provider value={context}>
        
        <DndProvider backend={HTML5Backend}>
            <Cribbage />
        </DndProvider>

    </ReactCribbageContext.Provider>;
}