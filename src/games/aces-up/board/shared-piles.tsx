import React from "react";
import styled from "styled-components";
import { rankName } from "../../../utils/cards/types";
import { useGameContext } from "../client-side/game-context";
import { SharedPile } from "../game-control/shared-pile";
import { CardWithText } from "./card-with-text";

const SharedPilesDiv = styled.div`
    display: flex;
    flex-wrap: wrap;

    > *:not(:last-child) {
        margin-right: 5px;
    }
`;

interface PileProps {
    pile: SharedPile;
}

function Pile(props: PileProps) {
    const { pile: {top, rank} } = props;

    return <CardWithText card={top} 
        text={rank && rankName(rank)}
    />;
}

export function SharedPiles() : JSX.Element {
    const { G: {sharedPiles} } = useGameContext();

    return <SharedPilesDiv> {sharedPiles.map((pile, index) => 
        <Pile key={index} pile={pile} />
    )}
    <CardWithText/>
    </SharedPilesDiv>;
}