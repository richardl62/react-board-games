import React, { useState } from "react";
import styled from "styled-components";
import { PieceHolder, PieceHolderStyle, DragDrop } from "../board/piece-holder";
import { Card, CardSVG } from ".";
import { cardSize } from "./styles";
import { cardName, compareCards } from "./types";

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

/** check if the arrays have the same values after sorting */
function sameContent(cards1: (Card | null)[], cards2: (Card|null)[]) : boolean {
    if(cards1.length !== cards2.length) {
        return false;
    }

    const compare = (c1: Card|null, c2: Card| null) => {
        if (c1 === null && c2 === null)  {
            return 0; 
        }

        if (c1 === null) {
            return -1;
        }

        if (c2 === null) {
            return 1;
        }

        return compareCards(c1, c2);
    };
    
    const sorted1=[...cards1].sort(compare);
    const sorted2=[...cards2].sort(compare);

    for(let i = 0; i < sorted1.length; ++i) {
        if(compare(sorted1[i], sorted2[i]) !== 0) {
            return false;
        }
    }

    return true;
}

interface HandProps {
    cards: (Card|null)[];
    showBack?: ShowBack;

    dragDrop?: {
        /** ID string. Must be uniques amongst all hands */
        handID: string,
        draggable?: boolean,
        onDrop?: OnDrop,

        /** If true, drags within the deck will be handled locally */ 
        localReordering?: boolean,
    }
}

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

function UnshuffledHand(props: HandProps) : JSX.Element {
    
    const { cards, showBack } = props;

    const style : PieceHolderStyle = {
        ...cardSize, // for hieght and widht
        background: {color: "white"},
    };


    return <HandDiv>
        {cards.map((card,index) => {
            const key = card ? cardName(card) : "empty";

            return <PieceHolder key={key} style={style} dragDrop={dragDropOptions(props, index)} >
                <CardSVG  card={card} showBack={showBack} />
            </PieceHolder>; 
        })}
    </HandDiv>;
}

export function Hand(props: HandProps) : JSX.Element {
    const [ shuffledCards, setShuffledCards ] = useState<HandProps["cards"]>(props.cards);

    const { dragDrop } = props;

    if(!dragDrop?.localReordering ) {
        return <UnshuffledHand {...props}/>;
    }

    if(!sameContent(props.cards, shuffledCards)) {
        setShuffledCards(props.cards);
    }

    const newOnDrop: OnDrop = (arg) => {
        if(arg.drag.handID === dragDrop.handID) {
            if(arg.drop) {
                setShuffledCards(doLocalDrag(shuffledCards, arg.drag.index, arg.drop.index));
            }
        } else if(dragDrop.onDrop) {
            dragDrop.onDrop(arg);
        }
    };

    return <UnshuffledHand {...props}
        cards={shuffledCards}
        dragDrop={{...dragDrop, onDrop: newOnDrop}}    
    />;
}


function doLocalDrag(
    cards_: (Card | null)[],
    dragIndex: number,
    dropIndex: number,
): (Card | null)[] {
    const cards = [...cards_];

    const dragged = cards[dragIndex];
    if(dragIndex < dropIndex) {
        for(let i = dragIndex; i < dropIndex; ++i) {
            cards[i] = cards[i+1];
        }
    } else if (dragIndex > dropIndex) {
        for(let i = dragIndex; i > dropIndex; --i) {
            cards[i] = cards[i-1];
        }
    }
    cards[dropIndex] = dragged;

    return cards;
}

