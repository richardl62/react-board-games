import React from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import { sAssert } from "../assert";
import { CardSVG } from "./card";

type CardProps = Parameters<typeof CardSVG>[0];

export const playingCard = "playing card";

const InlineDiv = styled.div`
    display: inline;  
`;

interface CardID {
    handID: string;
    /** A null index is used when a drop target is a hand rather than a
     * specific card */
    index: number;
}

function getCardID(arg: unknown) : CardID {
    const cid = arg as CardID;
    sAssert(typeof cid === "object" &&
        typeof cid.handID === "string" && 
        typeof cid.index === "number",
    "Bad card ID");
    
    return cid; 
}

interface CardDnDProps extends CardProps {
    cardID: CardID;

    draggable: boolean;
    dropTarget: boolean;


    /** If set, the card is draggable with the given function being called
     *  the end if a sucessful drag (i.e. one which finished on a valid
     *  drop target.)
     */
     onDrop: (arg: {from:CardID, to: CardID}) => void;
}

export function CardDnD(props: CardDnDProps) : JSX.Element {
    const { cardID, draggable, dropTarget, onDrop } = props;

    const [, dragRef] = useDrag(() => ({
        type: playingCard,
        item: cardID,
    }), [cardID]);

    const [, dropRef] = useDrop(() => ({
        accept: playingCard,
        drop: (draggedID) => onDrop({
            from: getCardID(draggedID),
            to: cardID
        })
    }), [cardID]);


    return <InlineDiv ref={dropTarget ? dropRef : undefined}>
        <InlineDiv ref={draggable ? dragRef : undefined }>
            <CardSVG {...props} />
        </InlineDiv>
    </InlineDiv>;
}