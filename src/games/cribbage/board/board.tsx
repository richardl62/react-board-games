import React from "react";
import styled from "styled-components";
import { CutCard } from "./cut-card";
import { WrappedScoreBoard } from "./wrapped-score-board";
import { CardSetID } from "../server-side/server-data";
import { MessageAndButton } from "./message-and-button";
import { useCribbageContext } from "../client-side/cribbage-context";
import { HandWrapper } from "./hand-wrapper";
import { standardOuterMargin } from "../../../app-game-support/styles";


const GameAreaDiv = styled.div`
    display: inline flex;
    div {
        margin-right: 5px;
    }

    margin: ${standardOuterMargin};
`;

const Hands = styled.div`
    margin-left: 20px;
    > * {
        margin-bottom: 40px;
    };
`;

function Board() : JSX.Element {
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

export default Board;
