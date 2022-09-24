import React from "react";
import styled from "styled-components";
import { useCribbageContext } from "../client-side/cribbage-context";
import { GameStage } from "../client-side/game-state";

const OuterDiv = styled.div`
    display: flex;

    font-size: 20px;
    span {
        margin-right: 10px;
    }
`;

function MakingBox() {
    const { dispatch, stage } = useCribbageContext();
    if(stage !== GameStage.SettingBox) {
        return null;
    }

    const onClick = () => dispatch({type: "doneMakingBox"});

    return <OuterDiv>
        <span>Add Cards to box</span>
        <button onClick={onClick}>Done</button>
    </OuterDiv>;
}

function Pegging() {
    const { stage } = useCribbageContext();
    if(stage !== GameStage.Pegging) {
        return null;
    }

    return <div>Pegging</div>;
}

export function MessageAndButton() : JSX.Element {
    return <>
        <MakingBox />
        <Pegging />
    </>;
}