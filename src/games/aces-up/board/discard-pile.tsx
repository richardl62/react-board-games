import React from "react";
import styled from "styled-components";
import { CardNonJoker, CardSVG } from "../../../utils/cards";

const OuterDiv = styled.div`
  position: relative;  
`;


interface Props {
    cards: CardNonJoker[];
}

export function DiscardPile(props: Props) : JSX.Element {
    const { cards } = props;
    return <OuterDiv>
        <CardSVG card={cards[0]} />
    </OuterDiv>;
}
