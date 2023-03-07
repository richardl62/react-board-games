import React from "react";
import styled from "styled-components";

import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";


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

interface Props extends WrappedGameProps {
    children: React.ReactNode;
}
export function OuterBoard(props: Props) : JSX.Element {
    const { offline, ctx: {numPlayers}, children } = props;
    
    const Div = (offline && numPlayers > 1) ? OuterDivMultiplePlayers
        : OuterDivSinglePlayer;

    return <Div>{children}</Div>;
}


