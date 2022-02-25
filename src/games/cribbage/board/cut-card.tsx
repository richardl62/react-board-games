import React from "react";
import styled from "styled-components";
import { CardSVG } from "../../../utils/cards";
import { useCribbageContext } from "../cribbage-context";

const DeckDiv = styled.div`
    display: inline-flex;
    flex-direction: column;  
    align-items: center;
    button  {
        width: 75%;
        margin-top: 3%;
    }
`;

export function CutCard() : JSX.Element {
    const { cutCard } = useCribbageContext();

    if( cutCard ) {
        return <CardSVG card={cutCard} />; 
    }

    return <DeckDiv>    
        <CardSVG showBack /> 
        <button>Cut</button>
    </DeckDiv>;
}
