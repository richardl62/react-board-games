import React from "react";
import styled from "styled-components";
import { useGameContext } from "../game-support/game-context";
import { SharedPile as SharedPileClass, makeSharedPiles } from "../game-control/shared-pile";
import { columnGap } from "../game-support/styles";
import { SharedPile } from "./shared-pile";
import { CardNonJoker } from "../../../utils/cards";
import { cardShortName } from "../../../utils/cards/types";
import { cardStackHeight } from "./card-stack";
import { AreaLabelBelow } from "./area-label";
import { cardSize } from "../../../utils/cards/styles";

export const TextDiv = styled.div`
    text-align: center;
`;

// Formula is a Kludge. It's atleast big enough to ensure that the lower 
// elements dont move during the game.
const sharedPilesHeight = `calc(${cardStackHeight(2)}px + 2em)`;

const OuterDiv = styled.div`
    align-self: start;
    min-height: ${sharedPilesHeight};

    margin-left: ${cardSize.width/2}px;
`;

const Piles = styled.div`
    display: inline-flex;
    flex-wrap: wrap;
    column-gap: ${columnGap.betweenCards};
`;

export function SharedPiles() : JSX.Element {
    const { G } = useGameContext();
    const sharedPiles = makeSharedPiles(G);
    
    // Kludge
    const key = (pile: SharedPileClass, index: number) => {
        const name = (card: CardNonJoker | undefined ) =>
            card && cardShortName(card);
        const {old, thisTurnStandard: thisRoundStandard} = pile.tops();
        return `${name(old)}-${name(thisRoundStandard)}-${index}`; 
    };
        
    return <OuterDiv>
        <Piles> {
            sharedPiles.map((pile, index) =>
                <SharedPile key={key(pile, index)} pile={pile} pileIndex={index} />)
        }
        </Piles>
        <AreaLabelBelow>Shared Piles</AreaLabelBelow>
    </OuterDiv>;
}