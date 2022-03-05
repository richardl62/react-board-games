import React from "react";
import { CardSVG } from "./card";

type CardProps = Parameters<typeof CardSVG>[0];

export interface CardID {
    handID: string;
    index: number;
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
    return <CardSVG {...props}/>;
}