import React, { useState } from "react";
import { BasicHand, HandProps, OnDrop } from "./basic-hand";


/** Check if the arrays have the same values after sorting 
 * (Implementation is inefficient)
*/
function sameContent<T>(cards1: T[], cards2: T[]) : boolean {
    if(cards1.length !== cards2.length) {
        return false;
    }

    const compare = (c1: T, c2: T) => 
        JSON.stringify(c1).localeCompare(JSON.stringify(c2));
    
    const sorted1=[...cards1].sort(compare);
    const sorted2=[...cards2].sort(compare);

    for(let i = 0; i < sorted1.length; ++i) {
        if(compare(sorted1[i], sorted2[i]) !== 0) {
            return false;
        }
    }

    return true;
}

/** Reorder array elements to reflect a drag from 'from' to 'to'.
 * 
 *  Any element between 'from' and 'to' are shuffled up/down as appropriate
 *  (i.e. towards 'from').
 * 
 *  The array is processed in place, and is then returned.
 */
function reorderFollowingDrag<T>(
    array: T[],
    from: number,
    to: number,
): T[] {

    const dragged = array[from];
    if(from < to) {
        for(let i = from; i < to; ++i) {
            array[i] = array[i+1];
        }
    } else if (from > to) {
        for(let i = from; i > to; --i) {
            array[i] = array[i-1];
        }
    }
    array[to] = dragged;

    return array;
}

export function Hand(props: HandProps) : JSX.Element {
    const [ shuffledCards, setShuffledCards ] = useState<HandProps["cards"]>(props.cards);

    const { dragDrop } = props;

    if(!dragDrop?.localReordering ) {
        return <BasicHand {...props}/>;
    }

    if(!sameContent(props.cards, shuffledCards)) {
        setShuffledCards(props.cards);
    }

    const newOnDrop: OnDrop = (arg) => {
        if(arg.drag.handID === dragDrop.handID) {
            if(arg.drop) {
                const from = arg.drag.index;
                const to = arg.drop.index;
                // Passing a function is necessart to ensures that the reorder 
                // uses the most recent state.
                setShuffledCards(cards => {
                    const newCards = [...cards];
                    reorderFollowingDrag(newCards, from, to);
                    return newCards;
                });
            }
        } else if(dragDrop.onDrop) {
            dragDrop.onDrop(arg);
        }
    };

    return <BasicHand {...props}
        cards={shuffledCards}
        dragDrop={{...dragDrop, onDrop: newOnDrop}}    
    />;
}

