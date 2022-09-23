import React from "react";
import styled from "styled-components";
import { CutCard } from "./cut-card";
import { PlayerCards, SharedCards } from "./hands";
import { WrappedScoreBoard } from "./wrapped-score-board";


const GameAreaDiv = styled.div`
    display: inline flex;
    div {
        margin-right: 5px;
    }
`;


export function GameArea() : JSX.Element {

    return <GameAreaDiv>
        <CutCard/>

        <div>
            <PlayerCards playerID={"pone"} />
            <SharedCards />
            <PlayerCards playerID={"me"} />
        </div>
          
        <WrappedScoreBoard/>

    </GameAreaDiv>;
}

