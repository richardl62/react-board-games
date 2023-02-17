import React from "react";
import styled from "styled-components";
import { cardName, rankName } from "../../../utils/cards/types";
import { useGameContext } from "../game-support/game-context";
import { SharedPile } from "../game-control/shared-pile";
import { CardDraggable } from "./drag-drop";

const TextDiv = styled.div`
    /* KLUDGE: This positioning avoid a gap between card and text.
    I don't know the reason for the gap. */
    position: relative;
    top: -10px;

    font-size: 20px;
    text-align: center;
    font-weight: bold;
`;

const SharedPilesDiv = styled.div`
    display: flex;
    flex-wrap: wrap;

    > *:not(:last-child) {
        margin-right: 5px;
    }
`;

interface PileProps {
    pile: SharedPile;
    pileIndex: number;
}

function Pile(props: PileProps) {
    const { pile, pileIndex } = props;

    const showRank = pile.rank && pile.rank !== pile.top.rank;
    
    return <div>
        <CardDraggable card={pile.top} 
            id={{area: "sharedPiles", index: pileIndex}} 
        />
        <TextDiv> {showRank && rankName(pile.rank)} </TextDiv>

    </div>;
}

export function SharedPiles() : JSX.Element {
    const { G: {sharedPiles} } = useGameContext();

    return <SharedPilesDiv> {sharedPiles.map((pile, index) => {
        const name = pile.top ? cardName(pile.top) : "empty";
        return <Pile key={name+index} pile={pile} pileIndex={index} />;
    })}
    </SharedPilesDiv>;
}