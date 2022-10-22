import React from "react";
import styled from "styled-components";
import { useCribbageContext } from "../client-side/cribbage-context";
import { GameStage } from "../server-side/server-data";
import { MakingBox } from "./making-box";
import { Pegging } from "./pegging";

export const OuterDiv = styled.div`
    display: flex;

    font-size: 20px;
    button {
        margin-left: 10px;
    }
`;

function Scoring() {
    const { stage, moves } = useCribbageContext();
    if(stage !== GameStage.HandsRevealed) {
        return null;
    }

    const newDeal = () => moves.newDeal();

    return <OuterDiv>
        <span>Scoring</span>
        <button onClick={newDeal}>Done (new deal)</button>
    </OuterDiv>;
}

export function MessageAndButton() : JSX.Element {
    return <>
        <MakingBox />
        <Pegging />
        <Scoring />
    </>;
}