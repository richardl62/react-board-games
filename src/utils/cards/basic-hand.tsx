import React from "react";
import styled from "styled-components";
import { CardSVG } from ".";
import { DragDrop, PieceHolder, PieceHolderStyle } from "../board/piece-holder";
import { cardSize } from "./styles";
import { Card, cardName } from "./types";

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

function dragDropOptions(props: HandProps, index: number) {
    if (!props.dragDrop) {
        return;
    }

    const { handID, draggable, onDrop } = props.dragDrop;

    const result: DragDrop<CardID> = {
        /** Id of piece to drag. Used as parameter to onDrop.
         */
        id: {
            handID: handID,
            index: index,
            card: props.cards[index],
        },

        draggable: Boolean(draggable),

        end: onDrop,
    };

    return result;
}

export interface HandProps {
    cards: (Card|null)[];
    showBack?: ShowBack;

    dragDrop?: {
        /** ID string. Must be uniques amongst all hands */
        handID: string,
        draggable?: boolean,
        onDrop?: OnDrop,

        /** If true, dragging within the deck is handled locally */ 
        localReordering?: boolean, // Not used in this file.
    }
}

export function BasicHand(props: HandProps): JSX.Element {

    const { cards, showBack } = props;

    const style: PieceHolderStyle = {
        ...cardSize,
        background: { color: "white" },
    };


    return <HandDiv>
        {cards.map((card, index) => {
            const key = card ? cardName(card) : "empty";

            return <PieceHolder key={key} style={style} dragDrop={dragDropOptions(props, index)}>
                <CardSVG card={card} showBack={showBack} />
            </PieceHolder>;
        })}
    </HandDiv>;
}
