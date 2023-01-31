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