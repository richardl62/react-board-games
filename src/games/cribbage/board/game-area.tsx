import React from "react";
import styled from "styled-components";
import { CutCard } from "./cut-card";
import { Hand } from "./hand";
import { WrappedScoreBoard } from "./wrapped-score-board";
import { CardSetID } from "../client-side/game-state";
import { MessageAndButton } from "./message-and-button";


const GameAreaDiv = styled.div`
    display: inline flex;
    div {
        margin-right: 5px;
    }
`;

const Hands = styled.div`
    margin-left: 20px;
    > * {
        margin-bottom: 40px;
    };
`;


export function GameArea() : JSX.Element {

    return <GameAreaDiv>
        <CutCard/>

        <Hands>
            <Hand cardSetID={CardSetID.Pone} />
            <Hand cardSetID={CardSetID.Shared} />
            <div>
                <Hand cardSetID={CardSetID.Me} />
                <MessageAndButton />
            </div>
        </Hands>
          
        <WrappedScoreBoard/>

    </GameAreaDiv>;
}

