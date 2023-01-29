import React from "react";
import { makeBasicsContext, ReactBasicsContext } from "../client-side/basics-context";
import { GameArea } from "./game-area";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { GameWarnings } from "../../../app-game-support";
import { ErrorMessage } from "../../../utils/error-message";
import { BasicsGameProps } from "../client-side/basics-game-props";

interface BoardProps {
    gameProps: WrappedGameProps;
} 

function Board(props: BoardProps): JSX.Element {
    const { gameProps } = props;
    const basicGameProps = gameProps as unknown as BasicsGameProps;
    const { G: { serverError} } = basicGameProps;
    
    return <ReactBasicsContext.Provider value={makeBasicsContext(basicGameProps)}>
        <GameWarnings {...gameProps}/>
        <ErrorMessage category="server error" message={serverError} />
        
        <DndProvider backend={HTML5Backend}>
            <GameArea />
        </DndProvider>

    </ReactBasicsContext.Provider>;
}

export default Board;