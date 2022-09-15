import React from "react";
import { ReactCribbageContext } from "../cribbage-context";
import { Cribbage } from "./game";
import { useCribbageReducer } from "../actions/use-cribbage-reducer";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export function Board(): JSX.Element {
    const [state, dispatch] = useCribbageReducer();

    const context = {...state,
        dispatch: dispatch,
    };
    return <ReactCribbageContext.Provider value={context}>
        
        <DndProvider backend={HTML5Backend}>
            <Cribbage />
        </DndProvider>

    </ReactCribbageContext.Provider>;
}