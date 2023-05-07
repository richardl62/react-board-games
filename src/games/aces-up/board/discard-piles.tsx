import React from "react";
import styled from "styled-components";
import { CardID } from "../game-control/card-id";
import { useGameContext } from "../game-support/game-context";
import { columnGap } from "../game-support/styles";
import { AreaLabelBelow } from "./area-label";
import { CardStack } from "./card-stack";
import { PlayerInfo } from "./player-info";
import { makeDiscardPiles } from "../game-control/make-discard-pile";

const PilesDiv = styled.div`
    display: flex;
    
    column-gap: ${columnGap.betweenCards};
`;

interface Props {
    playerInfo: PlayerInfo;
}

export function Discards(props: Props) : JSX.Element {
    const { playerInfo: { owner } } = props;    
    const { G } = useGameContext();

    const discardPiles = makeDiscardPiles(G, owner);
    

    const discardPilesElems = discardPiles.map((pile,pileIndex) => {
        const dropID: CardID = {area:"discardPileAll", pileIndex, owner};
        const dragID = (cardIndex: number) : CardID => {
            return {area:"discardPileCard", pileIndex, cardIndex, owner};
        };

        return <CardStack key={pileIndex} cards={pile.cards} 
            dropID={dropID}
            dragID={dragID}/>;
    });

    return <div>
        <PilesDiv> {discardPilesElems} </PilesDiv>
        <AreaLabelBelow>Discards</AreaLabelBelow>
    </div>;
}
