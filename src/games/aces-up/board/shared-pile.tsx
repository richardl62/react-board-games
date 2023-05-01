import React from "react";
import { rankName } from "../../../utils/cards/types";
import { SharedPile as SharedPileType, rank } from "../game-control/shared-pile";
import { CardStack } from "./card-stack";
import { TextDiv } from "./shared-piles";

export function SharedPile(props: {
    pile: SharedPileType;
    pileIndex: number;
}): JSX.Element  {
    const { pile, pileIndex } = props;
    const { oldCards, cardsPushedThisRound } = pile;
    

    const oldTop = oldCards.at(-1);
    const newTop = cardsPushedThisRound.at(-1);

    // Get the top cards, if any, of the two sub-piles
    const displayCards = [oldTop ? oldTop : null];
    if ( newTop ) {
        displayCards.push(newTop);
    }

    const kingOnTop = displayCards.at(-1)?.rank === "K";

    return <div>
        <CardStack
            cards={displayCards}
            dropID={{ area: "sharedPiles", index: pileIndex }}
        />
        <TextDiv> {kingOnTop && rankName(rank(pile)!)} </TextDiv>
    </div>;
}
