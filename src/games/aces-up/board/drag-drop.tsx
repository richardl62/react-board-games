import React from "react";
import { useDrag } from "react-dnd";
import { CardSVG } from "../../../utils/cards";
import { useGameContext } from "../client-side/game-context";
import { isDraggable } from "../game-control/allow-drag";
import { CardLocation } from "../game-control/card-location";

const dndType = "Card";

type CardSVGProps = Parameters<typeof CardSVG>[0];

interface Props extends CardSVGProps {
    location: CardLocation
}

export function CardDraggable(props: Props): JSX.Element {
    const { location } = props;
    const ctx = useGameContext();


    const [, dragRef] = useDrag(
        () => ({
            type: dndType,
            item: { location },
            //   collect: (monitor) => ({
            //     opacity: monitor.isDragging() ? 0.5 : 1
            //   })
        }),
        []
    );

    const card = <CardSVG {...props} />;
    if (isDraggable(ctx, location)) {
        return <div ref={dragRef}>{card}</div>;
    } else {
        return card;
    }
}