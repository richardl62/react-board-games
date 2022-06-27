import React, { useEffect, useReducer } from "react";
import { useAsync } from "react-async-hook";
import { AsyncStatus } from "../../../utils/async-status";
import { getWordChecker } from "../../../utils/get-word-checker";
import { makeCrossTilesContext, ReactCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { CrossTilesGameProps } from "../client-side/actions/cross-tiles-game-props";
import { crossTilesReducer, initialReducerState } from "../client-side/actions/cross-tiles-reducer";
import { GameStage } from "../server-side/server-data";


export interface ContextProviderPlusProps {
    gameProps: CrossTilesGameProps;
    children: React.ReactNode;
}

function ContextProviderPlus(props: ContextProviderPlusProps): JSX.Element {
    const { gameProps, children } = props;
    const { playerID } = gameProps;

    const [reducerState, dispatch] = useReducer(crossTilesReducer, 
        initialReducerState(playerID));

    const { stage } = gameProps.G;

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

    if(reducerState.serverData?.timestamp !== gameProps.G.timestamp) {
        dispatch({type: "reflectServerData", data: gameProps.G});
    }

    
    const asyncWordChecker = useAsync(() => {
        const checkSpelling = gameProps.G.options.checkSpelling;
        if(checkSpelling) {
            return getWordChecker();
        }

        const dummyWordChecker = () => true;
        return Promise.resolve(dummyWordChecker);
    }, []);

    const isLegalWord = asyncWordChecker.result;
    if (!isLegalWord) {
        return <AsyncStatus status={asyncWordChecker} activity="loading dictionary" />;
    }

    const context = makeCrossTilesContext(gameProps, reducerState, dispatch, isLegalWord);

    return <ReactCrossTilesContext.Provider value={context}>
        {children}
    </ReactCrossTilesContext.Provider>;
}

export default ContextProviderPlus;

