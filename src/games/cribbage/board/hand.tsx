import React from "react";
import styled from "styled-components";
import { PieceHolder, PieceHolderStyle, DragDrop } from "../../../utils/board/piece-holder";
import { Card, CardSVG } from "../../../utils/cards";
import { cardSize } from "../../../utils/cards/styles";
import { cardName } from "../../../utils/cards/types";

type ShowBack = Parameters<typeof CardSVG>[0]["showBack"];

interface CardID {
    handID: string;
    index: number;
    card: Card | null;
}

const HandDiv = styled.div`
    display: flex;
`;

interface Props {
    cards: (Card|null)[];

    showBack?: ShowBack;
}

const handID = "hand";

export function Hand(props: Props) : JSX.Element {
    
    const { cards, showBack } = props;

    const style : PieceHolderStyle = {
        ...cardSize, // for hieght and widht
        background: {color: "white"},
    };

    const dragDrop = (index: number) =>  {
        const result: DragDrop<CardID> = {
            /** Id of piece to drag. Used as parameter to onDrop.
             */
            id: {
                handID: handID,
                index: index,
                card: cards[index],
            },

            draggable: true,


            end: arg => {
                console.log("Drag", arg.drag);
                console.log("Drop", arg.drop);
            }
        };

        return result;
    };

    return <HandDiv>
        {cards.map((card,index) => {
            const key = card ? cardName(card) : "empty";

            return <PieceHolder key={key} style={style} dragDrop={dragDrop(index)} >
                <CardSVG  card={card} showBack={showBack} />
            </PieceHolder>; 
        })}
    </HandDiv>;
}