import React from "react";
import { CardSVG } from "../../../utils/cards";
import { useGameContext } from "../client-side/game-context";
import { SharedPile } from "../server-side/server-data";

interface PileProps {
    pile: SharedPile;
}

function Pile(props: PileProps) {
    const { pile: {top} } = props;

    return <CardSVG card={top} />;
}

export function SharedPiles() : JSX.Element {
    const { G: {sharedPiles} } = useGameContext();

    return <div> {sharedPiles.map((pile, index) => 
        <Pile key={index} pile={pile} />
    )}
    </div>;
}