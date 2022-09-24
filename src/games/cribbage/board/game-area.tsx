import React from "react";
import styled from "styled-components";
import { CutCard } from "./cut-card";
import { WrappedHand } from "./wrapped-hand";
import { WrappedScoreBoard } from "./wrapped-score-board";
import { CardSetID } from "../client-side/game-state";
import { MessageAndButton } from "./message-and-button";


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
            <WrappedHand cardSetID={CardSetID.Pone} />
            <WrappedHand cardSetID={CardSetID.Shared} />
            <WrappedHand cardSetID={CardSetID.Me} />
            <MessageAndButton />
        </div>
          
        <WrappedScoreBoard/>

    </GameAreaDiv>;
}

