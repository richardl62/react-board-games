import React from "react";
import styled from "styled-components";

import { standardBoard } from "../../../app-game-support/standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";

const LazyBoard = React.lazy(() => import("../board/inner-board"));

const OuterDivSinglePlayer = styled.div`
    /* Make sure that the whole div is at least as big as the window.
       This ensured that background-color applies to the whole window */
    width: 100%;
    min-height: 100vh;

    background-color: green;
    
    /* KLUDGE: This removes a several-pixel wide white marging at the
    top and bottom of the window. I am not sure why the margin was 
    there. */
    border: 1px green solid;

    color: white;
    font-size: 18px;
  
    font-family: Helvetica;
`;

const OuterDivMultiplePlayers = styled.div`
    width: 100%;
   
    background-color: green;
    color: white;
    font-size: 18px;
  
    font-family: Helvetica;
`;

function Board(props: WrappedGameProps) : JSX.Element {
    const { numPlayers } = props.ctx;
    const offline = props.matchID === "default";
    
    const Div = (offline && numPlayers > 1) ? OuterDivMultiplePlayers
        : OuterDivSinglePlayer;

    return <Div>
        {standardBoard(LazyBoard,props)}
    </Div>;
}

export default Board;

