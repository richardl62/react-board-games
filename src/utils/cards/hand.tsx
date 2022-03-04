import React from "react";
import styled from "styled-components";
import { CardSVG } from ".";
import { DragDrop, PieceHolder, PieceHolderStyle } from "../board/piece-holder";
import { cardSize } from "./styles";
import { Card } from "./types";

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
    };

    /** If set, a 'drop spot' is added at the end of the hand.
        This is an empty card which if dropped into will trigger a call
        t the given function. 
    */
    dropSpot?: {psuedoHandId: string}
}

export function Hand(props: HandProps): JSX.Element {

    const { cards, showBack, dropSpot } = props;

    const style: PieceHolderStyle = {
        ...cardSize,
        background: { color: "white" },
    };

    const elems = cards.map((card, index) => {
        const key = index; 
        return <PieceHolder key={key} style={style} dragDrop={dragDropOptions(props, index)}>
            <CardSVG card={card} showBack={showBack} />
        </PieceHolder>;
    });
    
    if (dropSpot) {
        const id: CardID = {
            handID: dropSpot.psuedoHandId,
            index: 0,
            card: null,
        };


        const dragDrop: DragDrop<CardID> = {
            id: id,
            draggable: false,
        };

        const elem = <PieceHolder key={"dropSpot"} style={style} dragDrop={dragDrop}>
            <CardSVG card={null} />
        </PieceHolder>;
        elems.push(elem);
    }

    return <HandDiv> {elems} </HandDiv>;
}
