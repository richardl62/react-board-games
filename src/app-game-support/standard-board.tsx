import React, { Suspense } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { sAssert } from "../utils/assert";
import { Warnings } from "./warnings/warnings";
import { WrappedGameProps } from "./wrapped-game-props";

export const ReactBasicsContext = React.createContext<WrappedGameProps| null>(null);

export function standardBoard(
    LazyBoard: ReturnType<typeof React.lazy>, 
    props: WrappedGameProps,

    /** Passed to the board. Intended for static configuration settings. 
     * (e.g. to distguish Scrabble from Simple Scrabble)
    */
    customData?: unknown,
) : JSX.Element
{   
    return <Suspense fallback={<div>Loading...</div>}>

        <ReactBasicsContext.Provider value={props}>
            <Warnings />
            <DndProvider backend={HTML5Backend}>
                <LazyBoard customData={customData}/>
            </DndProvider>
        </ReactBasicsContext.Provider>
    </Suspense>;
}

export function useStandardBoardContext() : WrappedGameProps {
    const context = React.useContext(ReactBasicsContext);
    sAssert(context);

    return context;
}
