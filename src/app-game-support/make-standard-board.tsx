import React, { Suspense } from "react";
import { WrappedGameProps } from "./wrapped-game-props";

type MakeBoardResult = (props: WrappedGameProps) => JSX.Element;
export function makeBoard(filePath: string): MakeBoardResult {
    // eslint-disable-next-line react/display-name
    return (props: WrappedGameProps) => {
        const LazyBoard = React.lazy(() => import(filePath));
        return <Suspense fallback={<div>Loading...</div>}>
            <LazyBoard gameProps={props} />
        </Suspense>;
    };
}

type FuncType = Parameters<typeof React.lazy>[0];
function standardBoard(importFunc: FuncType, props: WrappedGameProps) : JSX.Element
{   
    const LazyBoard = React.lazy(importFunc);
    return <Suspense fallback={<div>Loading...</div>}>
        <LazyBoard gameProps={props} />
    </Suspense>;
}

export function makeStandardBoard(importFunc: FuncType) : 
    (props: WrappedGameProps) => ReturnType<typeof standardBoard>
{
    return (props: WrappedGameProps) => standardBoard(importFunc, props);
}