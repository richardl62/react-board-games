import { JSX, Suspense } from "react";
import { DndProvider  } from "react-dnd-multi-backend";
import { HTML5toTouch } from "rdndmb-html5-to-touch";
import { sAssert } from "@utils/assert";
import { Warnings } from "./warnings";
import { BoardProps } from "./board-props";
import React from "react";

export const ReactBasicsContext = React.createContext<BoardProps| null>(null);

export function standardBoard(
    LazyBoard: ReturnType<typeof React.lazy>, 
    props: BoardProps,

    /** Passed to the board. Intended for static configuration settings. 
     * (e.g. to distguish Scrabble from Simple Scrabble)
    */
    customData?: unknown,
) : JSX.Element
{   
    return <Suspense fallback={<div>Loading...</div>}>

        <ReactBasicsContext.Provider value={props}>
            <Warnings />
            <DndProvider options={HTML5toTouch}>
                <LazyBoard customData={customData}/>
            </DndProvider>
        </ReactBasicsContext.Provider>
    </Suspense>;
}

export function useStandardBoardContext() : BoardProps {
    const context = React.useContext(ReactBasicsContext);
    sAssert(context);

    return context;
}
