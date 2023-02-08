import React from "react";
import styled from "styled-components";
import { Card, CardSVG } from "../../../utils/cards";

const OuterDiv = styled.div`
    /* See comment in TextDiv */
    position: relative;
`;

const TextDiv = styled.div`
    /* KLUDGE: This positioning avoid a gap between card and text.
    I don't know the reason for the gap. */
    position: relative;
    top: -10px;

    font-size: 20px;
    text-align: center;
    font-weight: bold;
`;

interface CardWithTextProps {
    card?: Card | null;
    text?: string | null;
}

export function CardWithText(props: CardWithTextProps) : JSX.Element {
    const { card, text } = props;
    return <OuterDiv>
        <CardSVG card={card} />
        <TextDiv> {text} </TextDiv>

    </OuterDiv>;
}
