import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { CardSVG } from "../../../utils/cards";
import { useGameContext } from "../game-support/game-context";
import { canDrag } from "../game-control/can-drag";
import { CardID, getCardID } from "../game-control/card-id";
import { canDrop } from "../game-control/can-drop";
import styled from "styled-components";
import { cardSize } from "../../../utils/cards/styles";

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

type DragRef = ReturnType<typeof useDrag>[1];
export function useCardDragRef(id: CardID) : DragRef | null {

    const ctx = useGameContext();

    const [, dragRef] = useDrag(
        () => ({
            type: dndType,
            item: id,
        }),
        []
    );

    return canDrag(ctx, id) ? dragRef : null;
}


interface Props extends CardSVGProps {
    id: CardID
}

const CD = styled.div`
    height: ${cardSize.height}px; //KLUDGE: This makes a difference, but I am not sure why.
`;

export function CardDraggable(props: Props): JSX.Element {
    const { id } = props;

    const dropRef = useCardDropRef(id);
    const dragRef = useCardDragRef(id);

    return <CD ref={dropRef}>
        <div ref={dragRef}>
            <CardSVG {...props} />
        </div>
    </CD>;
}
