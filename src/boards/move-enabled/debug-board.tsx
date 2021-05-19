import React, { useRef } from "react";
import { Board } from "./board";
import { BoardProps, SquareID } from "./types";


export function DebugBoard(props: BoardProps) {

    const startOfMove = useRef<SquareID|null>(null);

    const newProps: BoardProps = {
        ...props,
        onMoveStart: (id: SquareID) => {
            console.assert(startOfMove.current === null, "Move started before previous move ended");
            startOfMove.current = id;

            return props.onMoveStart?.(id);
        },

        onMoveEnd: (from: SquareID, to: SquareID | null) => {
            //console.log("DebugBoard onMoveEnd");
            console.assert(from === startOfMove.current,
                "Inconsistent start of move", startOfMove, from);
            startOfMove.current = null;
            props.onMoveEnd?.(from, to);
        },
    }
    return <Board {...newProps} />
}