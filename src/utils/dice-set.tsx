import React from "react";
import styled from "styled-components";
import { Die } from "./dice";

const OuterDiv = styled.div`
    display: flex;
    flex-direction: row;
    // gap between dice
    > * + * {
        margin-left: ${Die.diceSize * 0.1}px;
    };
`;
// A set of dice

export function DiceSet(props: { faces: number[]; }) {
    return (
        <OuterDiv>
            {props.faces.map((face, i) => (
                <Die face={face} key={i} />
            ))}
        </OuterDiv>
    );
}
