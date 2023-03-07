import React, { Suspense } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { sAssert } from "../utils/assert";
import { ErrorMessage } from "../utils/error-message";
import { GameWarnings } from "./show-warning";
import { WrappedGameProps } from "./wrapped-game-props";

export const ReactBasicsContext = React.createContext<WrappedGameProps| null>(null);

function serverError(props: WrappedGameProps) : string | null {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = (props.G as any).serverError;

    sAssert(typeof err === "string" || err === null, 
        "Server data G does not have 'serverError' field (or it has the wrong type)");
    return err;
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
        <ErrorMessage category="server error" message={serverError(props)} />

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
