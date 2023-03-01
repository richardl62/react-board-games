import React from "react";
import styled from "styled-components";
import { cardShortName } from "../../../utils/cards/types";
import { useGameContext } from "../game-support/game-context";
import { SharedPile as SharedPileType } from "../game-control/shared-pile";
import { columnGap } from "../game-support/styles";
import { SharedPile } from "./shared-pile";

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

    const key = (pile: SharedPileType, index: number) => {
        if(!pile.cards) {
            return index;
        }
        return pile.cards.reduce((str, card) => str + cardShortName(card), String(index));
    };
        
    return <SharedPilesDiv> {
        sharedPiles.map((pile, index) =>
            <SharedPile key={key(pile, index)} pile={pile} pileIndex={index} />)
    }
    </SharedPilesDiv>;
}