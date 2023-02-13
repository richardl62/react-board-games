import React from "react";
import { useDrag } from "react-dnd";
import { CardSVG } from "../../../utils/cards";
import { CardLocation } from "../game-control/card-location";

const dndType = "Card";

type CardSVGProps = Parameters<typeof CardSVG>[0];

interface Props extends CardSVGProps {
    location: CardLocation
}

export function CardDraggable(props: Props): JSX.Element {
    const { location } = props;
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

    return <div ref={dragRef}>
        <CardSVG {...props} /> 
    </div>;
}