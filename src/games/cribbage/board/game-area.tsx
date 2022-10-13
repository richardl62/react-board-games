import React from "react";
import styled from "styled-components";
import { CutCard } from "./cut-card";
import { WrappedScoreBoard } from "./wrapped-score-board";
import { CardSetID } from "../server-side/server-data";
import { MessageAndButton } from "./message-and-button";
import { useCribbageContext } from "../client-side/cribbage-context";
import { HandWrapper } from "./hand-wrapper";


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
    const {me, pone} = useCribbageContext();
    return <GameAreaDiv>
        <CutCard/>

        <Hands>
            <HandWrapper cardSetID={pone} />
            <HandWrapper cardSetID={CardSetID.Shared} />
            <div>
                <HandWrapper cardSetID={me} />
                <MessageAndButton />
            </div>
        </Hands>
          
        <WrappedScoreBoard/>

    </GameAreaDiv>;
}

