import React from "react";
import { useDrag } from "react-dnd";
import { CardSVG } from "../../../utils/cards";
import { useGameContext } from "../client-side/game-context";
import { isDraggable } from "../game-control/allow-drag";
import { CardID } from "../game-control/card-id";

const dndType = "Card";

type CardSVGProps = Parameters<typeof CardSVG>[0];

interface Props extends CardSVGProps {
    id: CardID
}

export function CardDraggable(props: Props): JSX.Element {
    const { id } = props;
    const ctx = useGameContext();


    const [, dragRef] = useDrag(
        () => ({
            type: dndType,
            item: { id },
            //   collect: (monitor) => ({
            //     opacity: monitor.isDragging() ? 0.5 : 1
            //   })
        }),
        []
    );

    const card = <CardSVG {...props} />;
    if (isDraggable(ctx, id)) {
        return <div ref={dragRef}>{card}</div>;
    } else {
        return card;
    }
}