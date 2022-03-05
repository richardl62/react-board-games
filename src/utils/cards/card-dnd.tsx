import React from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import { sAssert } from "../assert";
import { CardSVG } from "./card";

type CardProps = Parameters<typeof CardSVG>[0];

const playingCard = "playing card";

const InlineDiv = styled.div`
    display: inline;  
`;
export interface CardID {
    handID: string;
    index: number;
}

function isCardID(arg: unknown) : boolean {
    const cid = arg as CardID;
    return typeof cid === "object" &&
        typeof cid.handID === "string" && 
        typeof cid.index === "number"; 
}

interface CardDnDProps extends CardProps {
    /** If set, the card is draggable with the given function being called
     *  the end if a sucessful drag (i.e. one which finished on a valid
     *  drop target.)
     */
    dragEnd?: (arg: CardID) => void; 
    
    /** If set, the card is draggable with the given ID being pass to
     *  the dragged cards 'dragEnd' function.
     */
    dropID?: CardID;
}

export function CardDnD(props: CardDnDProps) : JSX.Element {
    const { dragEnd, dropID} = props;

    const [, dragRef] = useDrag(() => ({
        type: playingCard,
        item: dragEnd && true,
        end: (item: unknown, monitor) => {
            sAssert(dragEnd);
            const dropResult = monitor.getDropResult();


            if(dropResult) {
                // Unwrap the id. See "Note on Drag/drop ID" above.
                const dropID  = dropResult as CardID;
                sAssert(isCardID(dropID));
            
                dragEnd(dropID);
            }
        },
    }));

    const [, dropRef] = useDrop(() => ({
        accept: playingCard,
        drop: () => dropID,
    }));

    return <InlineDiv ref={dropID && dropRef}>
        <InlineDiv ref={dragEnd && dragRef}>
            <CardSVG {...props} />
        </InlineDiv>
    </InlineDiv>;
}