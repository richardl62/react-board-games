import { Ctx } from "boardgame.io";
import React from "react";
import { AppGame, GameCategory } from "../app-game-support";
import { DefaultMovesType, WrappedGameProps } from "../app-game-support/wrapped-game-props";
import { BoarderedGrid } from "../utils/board/boardered-grid";
import { DndProvider } from "../utils/board/drag-drop";
import { DragDrop, PieceHolder } from "../utils/board/piece-holder";

interface G {
  squares: number[];
}

const initialSquares = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
];
Object.freeze(initialSquares);

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SwapSquares({ G, moves }: WrappedGameProps<G, DefaultMovesType /*KLUDGE*/>): JSX.Element {
    const onReset = () => {
        moves.reset();
    };

    const onMove = (from: number, to: number) => {
        moves.swap(from, to);
    };

    const squareElems = G.squares.map((sq, index) => 
        <Square key={index} value={sq} position={index} onMove={onMove} />
    );

    return (
        <DndProvider>
            <div>
                <BoarderedGrid 
                    nCols={3} 
                    backgroundColor={"brown"} 
                    gridGap={"3px"}
                    borderWidth={"6px"}
                >
                    {squareElems}
                </BoarderedGrid>
            </div>

            <button type='button' onClick={onReset}>Reset</button>
        </DndProvider>
    );
}

const game: AppGame = {
    name: "swap-squares",
    displayName: "Swap Squares",
    category: GameCategory.test,

    setup: (): G => {
        return { squares: [...initialSquares] };
    },

    minPlayers: 1,
    maxPlayers: 1,

    moves: {
        swap: (G: G, _ctx: Ctx, from: number, to: number) => {
            if (from !== to) {
                const tmp = G.squares[to];
                G.squares[to] = G.squares[from];
                G.squares[from] = tmp;
            }
        },

        // Using the BGIO supplied reset function lead to server errros.
        // TO DO: Understand why this happened;
        reset: (G: G /*, ctx: Ctx*/) => {
            G.squares = [...initialSquares];
        },
    },

    board: (props: WrappedGameProps) => {
        const castProps = props as WrappedGameProps<G,DefaultMovesType/*KLUDGE*/>;
        return <SwapSquares {...castProps}/>;
    },
};

export default [ game ];
