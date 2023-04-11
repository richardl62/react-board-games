import React from "react";
import styled from "styled-components";
import { rankName } from "../../../utils/cards/types";
import { SharedPile as SharedPileType, rank } from "../game-control/shared-pile";
import { CardStack, cardStackHeight } from "./card-stack";
import { TextDiv } from "./shared-piles";

const SharedPileDiv = styled.div<{height: string}>`
    height: ${props => props.height};
`;

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

    return <SharedPileDiv height={`calc(${cardStackHeight(2)}px + 1em)`}>
        <CardStack
            cards={displayCards}
            dropID={{ area: "sharedPiles", index: pileIndex }} />
        <TextDiv> {kingOnTop && rankName(rank(pile)!)} </TextDiv>
    </SharedPileDiv>;
}
