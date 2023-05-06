import React from "react";
import { rankName } from "../../../utils/cards/types";
import { SharedPile as SharedPileClass } from "../game-control/shared-pile";
import { CardStack } from "./card-stack";
import { TextDiv } from "./shared-piles";

export function SharedPile(props: {
    pile: SharedPileClass;
    pileIndex: number;
}): JSX.Element  {
    const { pile, pileIndex } = props;

    const { old, thisTurnStandard, thisTurnSpecials } = pile.tops();
    // Get the top cards, if any, of the two sub-piles
    const displayCards = [old || null];
    if ( thisTurnSpecials ) {
        displayCards.push(thisTurnSpecials);
    } else if ( thisTurnStandard ) {
        displayCards.push(thisTurnStandard);
    }

    const displayRank = () => {
        const topCard = displayCards.at(-1);
        return topCard && topCard.rank !== pile.rank;
    };

    return <div>
        <CardStack
            cards={displayCards}
            dropID={{ area: "sharedPiles", index: pileIndex }}
        />
        <TextDiv> {displayRank() && rankName(pile.rank!)} </TextDiv>
    </div>;
}
