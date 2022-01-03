import React from "react";
import { sAssert } from "../../shared/assert";
import { getCardBackComponent, getCardComponent } from "./card-components";
import { cardSize, defaultCardBack } from "./styles";
import { Card, CardBack } from "./types";



interface CardPropsCard {
    card?: Card;
    showBack?: true | CardBack;
}

//
export function CardSVG(props: CardPropsCard): JSX.Element {
    const { card, showBack } = props;

    let Component;
    if (showBack) {
        const cardBack = showBack === true ? defaultCardBack : showBack;
        Component = getCardBackComponent(cardBack);
    } else {
        sAssert(card);
        Component = getCardComponent(card);
    }

    return <Component {...cardSize} />;
}
