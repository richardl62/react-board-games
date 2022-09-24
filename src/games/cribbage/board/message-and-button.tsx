import React from "react";
import styled from "styled-components";
import { useCribbageContext } from "../client-side/cribbage-context";

const OuterDiv = styled.div`
    display: flex;

    font-size: 20px;
    span {
        margin-right: 10px;
    }
`;

function MakingBox() {
    const { dispatch, box } = useCribbageContext();
    if(box) {
        return null;
    }

    const onClick = () => dispatch({type: "doneMakingBox"});

    return <OuterDiv>
        <span>Add Cards to box</span>
        <button onClick={onClick}>Done</button>
    </OuterDiv>;
}

function Pegging() {
    const { toPeg } = useCribbageContext();
    if(toPeg === null) {
        return null;
    }

    const name = toPeg === "me" ? "You" : "Pone";

    return <div>{`${name} to peg`}</div>;
}

export function MessageAndButton() : JSX.Element {
    return <>
        <MakingBox />
        <Pegging />
    </>;
}