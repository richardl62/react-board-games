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
    const { cutCard, dispatch } = useCribbageContext();

    if( cutCard.visible ) {
        return <CardSVG card={cutCard.card} />; 
    }
    const onClick = () => dispatch({type: "showCutCard"});
    return <DeckDiv>    
        <CardSVG showBack /> 
        <button onClick={onClick}>
            Cut
        </button>
    </DeckDiv>;
}
