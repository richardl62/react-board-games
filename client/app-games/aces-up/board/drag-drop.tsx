import { JSX } from "react";
import { useDrag, useDrop } from "react-dnd";
import { CardSVG } from "@utils/cards/card";
import { useMatchState } from "../game-support/match-state";
import { canMove } from "../game-support/can-move";
import { CardID, getCardID } from "@game-control/games/aces-up/moves/card-id";
import { moveType } from "@game-control/games/aces-up/moves/move-type";
import styled from "styled-components";
import { cardSize } from "@utils/cards/styles";
import { sAssert } from "@utils/assert";
import { dndRefKludge } from "@utils/dnd/dnd-ref-kludge";

const dndType = "Card";

type CardSVGProps = Parameters<typeof CardSVG>[0];


type DropRef = ReturnType<typeof useDrop>[1];
// eslint-disable-next-line react-refresh/only-export-components
export function useCardDropRef(id: CardID | null) : DropRef | null {
    const ctx = useMatchState();
    const { moveCard } = ctx.moves;

    const [, dropRef] = useDrop(() => ({
        accept: dndType,
        drop: (dragID) => {
            const from = getCardID(dragID);
            sAssert(id);
            moveCard({from, to: id});
        },
        canDrop: (item) => {
            sAssert(id);
            return moveType(ctx, {from: getCardID(item), to: id}) !== null;
        },

    }), [id]);

    return id && dropRef;
}

type DragRef = ReturnType<typeof useDrag>[1];
// eslint-disable-next-line react-refresh/only-export-components
export function useCardDragRef(id: CardID | null) : DragRef | null {

    const ctx = useMatchState();

    const [, dragRef] = useDrag(
        () => ({
            type: dndType,
            item: id,
        }),
        []
    );

    return id && canMove(ctx, id) ? dragRef : null;
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

    return <CD ref={dndRefKludge(dropRef)}>
        <div ref={dndRefKludge(dragRef)}>
            <CardSVG {...props} />
        </div>
    </CD>;
}
