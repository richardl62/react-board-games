import React from "react";
import styled from "styled-components";
import { useCribbageContext } from "../client-side/cribbage-context";
import { GameStage } from "../server-side/server-data";

const OuterDiv = styled.div`
    display: flex;

    font-size: 20px;
    button {
        margin-left: 10px;
    }
`;

function MakingBox() {
    const { dispatch, stage } = useCribbageContext();
    if(stage !== GameStage.SettingBox) {
        return null;
    }

    const doneMakingBox = () => dispatch({type: "doneMakingBox"});

    return <OuterDiv>
        <span>Add Cards to box</span>
        <button onClick={doneMakingBox}>Done</button>
    </OuterDiv>;
}

function Pegging() {
    const { stage, dispatch } = useCribbageContext();
    if(stage !== GameStage.Pegging) {
        return null;
    }

    const restartPegging = () => dispatch({type: "restartPegging"});
    const donePegging = () => dispatch({type: "donePegging"});

    return <OuterDiv>
        <span>Pegging</span>
        <button onClick={restartPegging}>Restart</button>
        <button onClick={donePegging}>Done (reveal hands)</button>
    </OuterDiv>;
}

function Scoring() {
    const { stage, dispatch } = useCribbageContext();
    if(stage !== GameStage.Scoring) {
        return null;
    }

    const newDeal = () => dispatch({type: "newDeal"});

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