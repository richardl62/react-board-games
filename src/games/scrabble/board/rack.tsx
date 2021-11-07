import React from "react";
import { Board, makeBoardProps } from "game-support/deprecated/boards";
import { sAssert } from "shared/assert";
import { boardIDs } from "../actions";
import { Actions } from "../actions";
import { squareSize } from "./style";
import { Tile } from "./tile";
import { useSquareInteraction } from "./square-interaction";
import { SquareID } from "../actions/actions";

interface RackProps {
    actions: Actions;
    selected: boolean[] | null;
    setSelected: (arg: boolean[]) => void;
}

export function Rack(props: RackProps): JSX.Element {
    const { actions, selected, setSelected } = props;
    
    const squareInteraction = useSquareInteraction(actions);

    const coreTiles = props.actions.rack;
    const tiles = coreTiles.map((tile, index) => tile && <Tile tile={tile}
        markAsMoveable={selected !== null && selected[index]}
    />);

    const toggleSelectForSwap = (sq: SquareID) => {
        return {
            onClick: () => {
                sAssert(selected);
                const newSwappable = [...selected];
                newSwappable[sq.col] = !newSwappable[sq.col];
                setSelected(newSwappable);
            }
        };
    };

    const boardProps = makeBoardProps({
        pieces: [tiles],

        squareBackground: () => { return { color: "white", text: "" }; },
        externalBorders: true,
        internalBorders: true,
        squareSize: squareSize,

        boardID: boardIDs.rack,

        squareInteraction: selected ? toggleSelectForSwap : squareInteraction,

        moveStart: null, //clickDragState.start,
    });

    return <Board {...boardProps} />;
}