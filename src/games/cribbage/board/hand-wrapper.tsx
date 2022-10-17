import React from "react";
import { Card } from "../../../utils/cards";
import { cardSize } from "../../../utils/cards/styles";
import { useCribbageContext } from "../client-side/cribbage-context";
import { dragAllowed, dropTarget } from "../client-side/dnd-control";
import { CardSetID, makeCardSetID } from "../server-side/server-data";
import { Hand } from "../../../utils/cards/hand";

interface HandWrapperProps {
    cardSetID: CardSetID;
}

export function HandWrapper(props: HandWrapperProps) : JSX.Element {
    const { cardSetID } = props;

    const context = useCribbageContext();
    const { moves} = context;

    const cardWidth = cardSize.width;
    const cardHeight = cardSize.height;
    const maxSeperation = cardSize.width / 12;
    
    let cards : (Card|null) [] = context[cardSetID].hand;
    if (cards.length === 0) {
        cards = [null];
    }

    const draggable = (index: number) => dragAllowed(context, {cardSetID, index});
    const dropable = (index?: number) => dropTarget(context, {cardSetID, index});

    const onDragEnd = (
        arg: {
            from: { handID: string, index: number },
            to: { handID: string, index?: number }
        }
    ) => {
        const {from, to} = arg;

        moves.drag({
            from: { cardSetID: makeCardSetID(from.handID), index: from.index },
            to: { cardSetID: makeCardSetID(to.handID), index: to.index },
        });
    };

    //dropTarget: (index?: number) => boolean;
    return <Hand 
        cards={cards}

        cardWidth={cardWidth}
        cardHeight={cardHeight}
        maxSeperation={maxSeperation}

        handID={cardSetID}
        draggable={draggable}
        dropTarget={dropable}

        onDrop={onDragEnd}
    />;
}

