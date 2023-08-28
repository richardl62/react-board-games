import React from "react";
import { BoarderedGrid } from "../../../utils/board/boardered-grid";
import { DragDrop, PieceHolder } from "../../../utils/board/piece-holder";
import { useGameContext } from "./game-context";

interface SquareProps {
    value: number;
    position: number;

    onMove: (from: number, to: number) => void;
}

interface SquareID {
    position: number;
}
function Square(props: SquareProps) : JSX.Element {
    const {value, position, onMove} = props;

    const dragDrop : DragDrop<SquareID> = {
        id: {position: position},
        draggable: true,
        end: ({drag, drop}) => {
            if(drop) {
                onMove(drag.position, drop.position);
            }
        },
    };

    const style={
        background: { color: "cornsilk" },
        height: "80px",
        width: "40px",
        borderColor: {
            hoverColor: "olive",
        },
    };

    return <PieceHolder
        style={style}
        dragDrop={dragDrop}
    >
        <div>{value}</div>
    </PieceHolder>;  
}

export default function Board(): JSX.Element {
    const ctx = useGameContext();
    const { G, moves } = ctx;
    const onReset = () => {
        moves.reset();
    };

    const onMove = (from: number, to: number) => {
        moves.swap({from, to});
    };

    const squareElems = G.squares.map((sq, index) => 
        <Square key={index} value={sq} position={index} onMove={onMove} />
    );

    return <div>
        <div>
            <BoarderedGrid
                nCols={G.options.numColumns}
                backgroundColor={"brown"}
                gridGap={"3px"}
                borderWidth={"6px"}
            >
                {squareElems}
            </BoarderedGrid>
        </div>

        <button type='button' onClick={onReset}>Reset</button>
    </div>;
}