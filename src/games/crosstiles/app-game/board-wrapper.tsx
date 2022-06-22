import React, { useEffect, useReducer } from "react";
import { useAsync } from "react-async-hook";
import { WrappedGameProps } from "../../../app-game-support";
import { AsyncStatus } from "../../../utils/async-status";
import { getWordChecker } from "../../../utils/get-word-checker";
import { makeCrossTilesContext, ReactCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { CrossTilesGameProps } from "../client-side/actions/cross-tiles-game-props";
import { crossTilesReducer, initialReducerState } from "../client-side/actions/cross-tiles-reducer";
import { GameStage } from "../server-side/server-data";


export interface BoardWrapperProps {
    appBoardProps: WrappedGameProps;
}

function BoardWrapper(props: BoardWrapperProps): JSX.Element {
    const crossTilesGameProps = props.appBoardProps as unknown as CrossTilesGameProps;

    const [reducerState, dispatch] = useReducer(crossTilesReducer, initialReducerState);

    const { stage } = crossTilesGameProps.G;

    const downHandler = (event: KeyboardEvent) => {
        if(stage === GameStage.makingGrids) {
            dispatch({ type: "moveFromRack", data: { letter: event.key } });
        }
    };

    // Add event listeners
    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        // Remove event listeners on cleanup
        return () => {
            window.removeEventListener("keydown", downHandler);
        };
    }, [stage]);

    if(reducerState.serverData?.timestamp !== crossTilesGameProps.G.timestamp) {
        dispatch({type: "reflectServerData", data: crossTilesGameProps.G});
    }
    
    const checkSpelling = crossTilesGameProps.G.options.checkSpelling;

    const asyncWordChecker = useAsync(getWordChecker, []);
    let isLegalWord;
    if (checkSpelling) {
        isLegalWord = asyncWordChecker.result;
        if (!isLegalWord) {
            return <AsyncStatus status={asyncWordChecker} activity="loading dictionary" />;
        }
    } else {
        isLegalWord = () => true;
    }

    const context = makeCrossTilesContext(crossTilesGameProps, reducerState, dispatch, isLegalWord);

    return <ReactCrossTilesContext.Provider value={context}>
        {/* <Board /> */}
    </ReactCrossTilesContext.Provider>;
}

export default BoardWrapper;

