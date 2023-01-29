import React from "react";
import { makeBoilerplateContext, ReactBoilerplateContext } from "../client-side/boilerplate-context";
import { GameArea } from "./game-area";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";
import { GameWarnings } from "../../../app-game-support";
import { ErrorMessage } from "../../../utils/error-message";
import { BoilerplateGameProps } from "../client-side/boilerplate-game-props";

interface BoardProps {
    gameProps: WrappedGameProps;
} 

function Board(props: BoardProps): JSX.Element {
    const { gameProps } = props;
    const boilerplateGameProps = gameProps as unknown as BoilerplateGameProps;
    const { G: { serverError} } = boilerplateGameProps;
    
    return <ReactBoilerplateContext.Provider value={makeBoilerplateContext(boilerplateGameProps)}>
        <GameWarnings {...gameProps}/>
        <ErrorMessage category="server error" message={serverError} />
        
        <DndProvider backend={HTML5Backend}>
            <GameArea />
        </DndProvider>

    </ReactBoilerplateContext.Provider>;
}

export default Board;