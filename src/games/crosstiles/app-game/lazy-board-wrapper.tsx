import React, { Suspense } from "react";
import { WrappedGameProps } from "../../../app-game-support";

const BoardWrapper = React.lazy(() => import("./board-wrapper"));

export interface LazyBoardWrapperProps {
    appBoardProps: WrappedGameProps;
}

// Use Lazy/Suspense here rather than directly in BoardWrapper.
// This avoids some loading that would otherwise occur due to the imports used
// for board wrapper.
export function LazyBoardWrapper(props: LazyBoardWrapperProps): JSX.Element {
    return <Suspense fallback={<div>Loading...</div>}>
        <BoardWrapper {...props} />
    </Suspense>;
}
