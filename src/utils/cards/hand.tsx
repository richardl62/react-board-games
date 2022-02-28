import React from "react";
import styled from "styled-components";
import { PieceHolder, PieceHolderStyle, DragDrop } from "../board/piece-holder";
import { Card, CardSVG } from ".";
import { cardSize } from "./styles";
import { cardName } from "./types";

type ShowBack = Parameters<typeof CardSVG>[0]["showBack"];

export interface CardID {
    handID: string;
    index: number;
    card: Card | null;
}

const HandDiv = styled.div`
    display: flex;
`;

export type OnDrop = Required<DragDrop<CardID>>["end"];
interface Props {
    cards: (Card|null)[];
    showBack?: ShowBack;

    dragDrop?: {
        handID: string,
        draggable?: boolean,
        onDrop?: OnDrop,
    }
}

export function Hand(props: Props) : JSX.Element {
    
    const { cards, showBack } = props;

    const style : PieceHolderStyle = {
        ...cardSize, // for hieght and widht
        background: {color: "white"},
    };

    const dragDropOptions = (index: number) =>  {
        if(!props.dragDrop) {
            return;
        }

        const { handID, draggable, onDrop} = props.dragDrop;

        const result: DragDrop<CardID> = {
            /** Id of piece to drag. Used as parameter to onDrop.
             */
            id: {
                handID: handID,
                index: index,
                card: cards[index],
            },

            draggable: Boolean(draggable),

            end: onDrop,
        };

        return result;
    };

    return <HandDiv>
        {cards.map((card,index) => {
            const key = card ? cardName(card) : "empty";

            return <PieceHolder key={key} style={style} dragDrop={dragDropOptions(index)} >
                <CardSVG  card={card} showBack={showBack} />
            </PieceHolder>; 
        })}
    </HandDiv>;
}