import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { CardSVG } from "../../../utils/cards";
import { useGameContext } from "../game-support/game-context";
import { isDraggable } from "../game-control/is-draggable";
import { CardID, getCardID } from "../game-control/card-id";
import { canDrop } from "../game-control/can-drop";

const dndType = "Card";

type CardSVGProps = Parameters<typeof CardSVG>[0];


type DropRef = ReturnType<typeof useDrop>[1];
export function useCardDropRef(id: CardID) : DropRef | null {
    const ctx = useGameContext();
    const { moveCard } = ctx.moves;

    const [, dropRef] = useDrop(() => ({
        accept: dndType,
        drop: (dragID) => {
            const from = getCardID(dragID);
            
            moveCard({from, to: id});
        },
        canDrop: (item) => canDrop(ctx, {from: getCardID(item), to: id}),

    }), [id]);

    return dropRef;
}

function useCardDragRef(id: CardID)  {

    const ctx = useGameContext();

    const [, dragRef] = useDrag(
        () => ({
            type: dndType,
            item: id,
        }),
        []
    );

    return isDraggable(ctx, id) ? dragRef : null;
}


interface Props extends CardSVGProps {
    id: CardID
}

export function CardDraggable(props: Props): JSX.Element {
    const { id } = props;

    const dropRef = useCardDropRef(id);
    const dragRef = useCardDragRef(id);

    return <div ref={dropRef}>
        <div ref={dragRef}>
            <CardSVG {...props} />
        </div>
    </div>;
}