import React from "react";
import { makeCribbageContext, ReactCribbageContext } from "../client-side/cribbage-context";
import { GameArea } from "./game-area";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { CribbageGameProps } from "../client-side/cribbage-game-props";
import { GameWarnings } from "../../../app-game-support";
import { ErrorMessage } from "../../../utils/error-message";

interface BoardProps {
    gameProps: WrappedGameProps;
} 

function Board(props: BoardProps): JSX.Element {
    const { gameProps } = props;
    const cribbageGameProps = gameProps as unknown as CribbageGameProps;
    const { G: { serverError} } = cribbageGameProps;
    
    return <ReactCribbageContext.Provider value={makeCribbageContext(cribbageGameProps)}>
        <GameWarnings {...gameProps}/>
        <ErrorMessage category="server error" message={serverError} />
        
        <DndProvider backend={HTML5Backend}>
            <GameArea />
        </DndProvider>

    </ReactCribbageContext.Provider>;
}

export default Board;