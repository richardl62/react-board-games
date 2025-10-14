import { JSX } from "react";
import styled from "styled-components";
import { CardID } from "../game-control/card-id";
import { useGameContext } from "../game-support/game-context";
import { columnGap } from "../game-support/styles";
import { AreaLabelBelow } from "./area-label";
import { CardStack } from "./card-stack";
import { PlayerInfo } from "./player-info";
import { makeDiscardPiles } from "../game-control/make-discard-pile";
import { DiscardPile as DiscardPileClass } from "../game-control/discard-pile";

const PilesDiv = styled.div`
    display: flex;
    
    column-gap: ${columnGap.betweenCards};
`;

function DiscardPile({pile, pileIndex, owner}: {
    pile: DiscardPileClass;
    pileIndex: number;
    owner: string;
}) : JSX.Element {
    const  {standard, recentSpecials} = pile.cards;
    const cards = [...standard, ...recentSpecials];

    const dropID: CardID = {area:"discardPileAll", pileIndex, owner};
    const dragID = (cardIndex: number) : CardID => {
        return {area:"discardPileCard", pileIndex, cardIndex, owner};
    };

    return <CardStack key={pileIndex} cards={cards} 
        dropID={dropID}
        dragID={dragID}/>;
}

export function Discards(props: {
    playerInfo: PlayerInfo;
}) : JSX.Element {
    const { playerInfo: { owner } } = props;    
    const { G } = useGameContext();

    const discardPiles = makeDiscardPiles(G, owner);
    

    return <div>
        <PilesDiv> 
            {discardPiles.map((pile, pileIndex) =>
                <DiscardPile key={pileIndex} pile={pile} pileIndex={pileIndex} owner={owner}/>
            )}
        </PilesDiv>
        <AreaLabelBelow>Discards</AreaLabelBelow>
    </div>;
}
