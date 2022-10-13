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

function isCardDndID(arg: unknown) : boolean {
    const cid = arg as CardID;
    return typeof cid === "object" &&
        typeof cid.handID === "string" && 
        (typeof cid.index === "number" || cid.index === null); 
}

interface CardDnDProps extends CardProps {
    cardID: CardID;

    dropTarget?: boolean;

    /** If set, the card is draggable with the given function being called
     *  the end if a sucessful drag (i.e. one which finished on a valid
     *  drop target.)
     */
     dragEnd?: (arg: {from:CardID, to: CardID}) => void;
}

export function CardDnD(props: CardDnDProps) : JSX.Element {
    const { cardID, dropTarget, dragEnd } = props;

    const [, dragRef] = useDrag(() => ({
        type: playingCard,
        item: cardID,
        end: (item: unknown, monitor) => {
            sAssert(dragEnd);
            const dropResult = monitor.getDropResult();


            if(dropResult) {
                // Unwrap the id. See "Note on Drag/drop ID" above.
                const dropID  = dropResult as CardID;
                sAssert(isCardDndID(dropID));
            
                dragEnd({from: cardID, to: dropID});
            }
        },
    }), [cardID]);

    const [, dropRef] = useDrop(() => ({
        accept: playingCard,
        drop: () => cardID,
    }), [cardID]);


    return <InlineDiv ref={dropTarget ? dropRef : undefined}>
        <InlineDiv ref={dragEnd ? dragRef : undefined }>
            <CardSVG {...props} />
        </InlineDiv>
    </InlineDiv>;
}