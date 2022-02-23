import React from "react";
import { Card, CardSVG } from "../../../utils/cards";
import { cardName } from "../../../utils/cards/types";

type ShowBack = Parameters<typeof CardSVG>[0]["showBack"];

interface Props {
    cards: (Card|null)[];

    showBack?: ShowBack;
}

export function Hand(props: Props) : JSX.Element {
    const { cards, showBack } = props;
    return <div>
        {cards.map(card => {
            const key = card ? cardName(card) : "empty";

            return <CardSVG key={key} card={card} showBack={showBack} />;
        })}
    </div>;
}