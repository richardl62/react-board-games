import React from "react";
import styled from "styled-components";
import { useGameContext } from "../game-support/game-context";
import { SharedPile as SharedPileType } from "../game-control/shared-pile";
import { columnGap } from "../game-support/styles";
import { SharedPile } from "./shared-pile";
import { CardNonJoker } from "../../../utils/cards";
import { cardShortName } from "../../../utils/cards/types";

export const TextDiv = styled.div`
    text-align: center;
`;

const SharedPilesDiv = styled.div`
    display: inline-flex;
    flex-wrap: wrap;

    column-gap: ${columnGap.betweenCards};
`;

export function SharedPiles() : JSX.Element {
    const { G: {sharedPiles} } = useGameContext();

    // Kludge
    const key = (pile: SharedPileType, index: number) => {
        const names = (cards: CardNonJoker[]) =>
            cards.reduce((str, card) => str + cardShortName(card), String(index));

        return `${names(pile.oldCards)}-${names(pile.cardsPushedThisRound)}-${index}}`; 
    };
        
    return <SharedPilesDiv> {
        sharedPiles.map((pile, index) =>
            <SharedPile key={key(pile, index)} pile={pile} pileIndex={index} />)
    }
    </SharedPilesDiv>;
}