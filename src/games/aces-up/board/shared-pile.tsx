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

    const { old, thisTurnStandard } = pile.tops();
    // Get the top cards, if any, of the two sub-piles
    const displayCards = [old || null];
    if ( thisTurnStandard ) {
        displayCards.push(thisTurnStandard);
    }

    const kingOnTop = displayCards.at(-1)?.rank === "K";

    return <div>
        <CardStack
            cards={displayCards}
            dropID={{ area: "sharedPiles", index: pileIndex }}
        />
        <TextDiv> {kingOnTop && rankName(pile.rank!)} </TextDiv>
    </div>;
}
