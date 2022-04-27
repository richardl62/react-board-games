import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { ClickMoveStart, SquareID } from "../client-side/actions/types";
import { Letter } from "../config";
import { SquareHelper } from "./square-helper";

const DnDType = "tile";

interface ActiveSquareProps {
    id: SquareID,
    letter: Letter | null;
    clickMoveDirection?: ClickMoveStart["direction"];
}

function ActiveSquare(props: ActiveSquareProps) : JSX.Element {
    const {letter, id, clickMoveDirection} = props;
    const { dispatch } = useCrossTilesContext();

    const [{isDragging}, dragRef] = useDrag(() => ({
        type: DnDType,
        item: id,
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }));

    const [, dropRef] = useDrop(() => ({
        accept: DnDType,
        drop: (draggedID: SquareID) => 
            dispatch({
                type: "move",
                data: { from: draggedID, to: id},
            }),
    }));

    return <SquareHelper 
        letter={isDragging ? null : letter}
        dragRef={dragRef}
        dropRef={dropRef}
        onClick={() => id && dispatch({ type: "tileClicked", data: { id } })}
        clickMoveDirection={clickMoveDirection}
    />;
}

interface SquareProps {
    id?: SquareID,
    letter: Letter | null;
    clickMoveDirection?: ClickMoveStart["direction"];
}

export function Square(props: SquareProps) : JSX.Element {
    const {letter, id} = props;

    if(id) {
        return <ActiveSquare {...props} id={id} />;
    }

    return <SquareHelper letter={letter} />;
}