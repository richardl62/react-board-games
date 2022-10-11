import React from "react";
import { makeCribbageContext, ReactCribbageContext } from "../client-side/cribbage-context";
import { GameArea } from "./game-area";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { CribbageGameProps } from "../client-side/cribbage-game-props";

interface BoardProps {
    gameProps: WrappedGameProps;
} 

// Temporary kludge: BoardProps are not used for now
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Board(props: BoardProps): JSX.Element {
    const { gameProps } = props;
    const crossTilesGameProps = gameProps as unknown as CribbageGameProps;

    
    return <ReactCribbageContext.Provider value={makeCribbageContext(crossTilesGameProps)}>
        
        <DndProvider backend={HTML5Backend}>
            <GameArea />
        </DndProvider>

    </ReactCribbageContext.Provider>;
}

export default Board;