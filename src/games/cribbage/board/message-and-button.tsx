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
    const context = useCribbageContext();
    const { stage, moves, me } = context;

    if(stage !== GameStage.HandsRevealed) {
        return null;
    }

    const newDeal = () => moves.newDeal(me);
    const requested = context[me].newDealRequested;
    return <OuterDiv>
        <span>Scoring</span>
        <button onClick={newDeal} disabled={requested}>Done (new deal)</button>
    </OuterDiv>;
}

export function MessageAndButton() : JSX.Element {
    return <>
        <MakingBox />
        <Pegging />
        <Scoring />
    </>;
}