import React from "react";
import styled from "styled-components";
import { PieceHolder, PieceHolderStyle, DragDrop } from "../../../utils/board/piece-holder";
import { Card, CardSVG } from "../../../utils/cards";
import { cardSize } from "../../../utils/cards/styles";
import { cardName } from "../../../utils/cards/types";

type ShowBack = Parameters<typeof CardSVG>[0]["showBack"];

const HandDiv = styled.div`
    display: flex;
`;

interface Props {
    cards: (Card|null)[];

    showBack?: ShowBack;
}

export function Hand(props: Props) : JSX.Element {
    const { cards, showBack } = props;

    const style : PieceHolderStyle = {
        ...cardSize, // for hieght and widht
        background: {color: "white"},
    };

    const dragDrop : DragDrop = { 
        /** Id of piece to drag. Used as parameter to onDrop.
         */
        id: {card: "card"},
    
        draggable: true,
    

        end: arg => {
            console.log("Drag", arg.drag, "drop", arg.drop);
        }
    };

    return <HandDiv>
        {cards.map(card => {
            const key = card ? cardName(card) : "empty";

            return <PieceHolder key={key} style={style} dragDrop={dragDrop} >
                <CardSVG  card={card} showBack={showBack} />
            </PieceHolder>; 
        })}
    </HandDiv>;
}