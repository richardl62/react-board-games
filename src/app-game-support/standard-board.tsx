import React, { Suspense } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { sAssert } from "../utils/assert";
import { ErrorMessage } from "../utils/error-message";
import { GameWarnings } from "./show-warning";
import { asRequiredState } from "./required-state";
import { WrappedGameProps } from "./wrapped-game-props";

export const ReactBasicsContext = React.createContext<WrappedGameProps| null>(null);

function moveError(props: WrappedGameProps) : string | null {
    const state = asRequiredState(props.G);

    sAssert(state, "Server data G does not have the required state");
    return state.moveError;
}

export function standardBoard(
    LazyBoard: ReturnType<typeof React.lazy>, 
    props: WrappedGameProps,

    /** Passed to the board. Intended for configuration settings. */
    customData?: unknown,
) : JSX.Element
{   
    return <Suspense fallback={<div>Loading...</div>}>
        <GameWarnings {...props}/>
        <ErrorMessage category="Error during move" message={moveError(props)} />

        <ReactBasicsContext.Provider value={props}>
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
