import { JSX } from "react";
import styled from "styled-components";
import { CardSVG } from "@utils/cards/card";
import { useCribbageState } from "../client-side/cribbage-state";

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
    const { cutCard, moves } = useCribbageState();


    const onClick = () => moves.showCutCard();
    return <DeckDiv>    
        <CardSVG card={cutCard.card} showBack={!cutCard.visible} /> 
        <button onClick={onClick} disabled={cutCard.visible}>
            Cut
        </button>
    </DeckDiv>;
}
