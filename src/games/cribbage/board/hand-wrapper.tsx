import React from "react";
import { Card } from "../../../utils/cards";
import { cardSize } from "../../../utils/cards/styles";
import { useCribbageContext } from "../client-side/cribbage-context";
import { CardSetID } from "../server-side/server-data";
import { Hand } from "./hand";

interface HandWrapperProps {
    cardSetID: CardSetID;
}

export function HandWrapper(props: HandWrapperProps) : JSX.Element {
    const { cardSetID } = props;

    const context = useCribbageContext();

    const cardWidth = cardSize.width;
    const cardHeight = cardSize.height;
    const maxSeperation = cardSize.width / 12;
    
    let cards : (Card|null) [] = context[cardSetID].hand;
    if (cards.length === 0) {
        cards = [null];
    }

    return <Hand 
        cards={cards}

        cardWidth={cardWidth}
        cardHeight={cardHeight}
        maxSeperation={maxSeperation}

        cardSetID={cardSetID}
    />;
}

