import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { AppGame, BoardProps } from "shared/types";
import { BoarderedGrid} from "game-support/boardered-grid";
import { PieceHolder, Border } from "game-support/piece-holder";
const squareSize = "50px";

const Background = styled.div<{color: string}>`
  height: ${squareSize};
  width: ${squareSize};
  background-color: ${props => props.color};
`;


interface G {
  squares: number[];
}

const initialSquares = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9,
];
Object.freeze(initialSquares);

function SwapSquares({ G, moves }: BoardProps<G>): JSX.Element {
    const onReset = () => {
        moves.reset();
    };

    const squareElems : JSX.Element[] = G.squares.map((sq, index) =>

        <PieceHolder key={index}>
            <Background color="cornsilk" />
            <div>{"F"+sq}</div>
            <Border color={index === 0 ? "green" : "cornsilk"} hoverColor="yellow" width="5px"/>
        </PieceHolder>  
    );

    return (
        <DndProvider backend={HTML5Backend}>
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
    displayName: "Swap Squares (for testing)",

    setup: (): G => {
        return { squares: [...initialSquares] };
    },

    minPlayers: 1,
    maxPlayers: 1,

    moves: {

        // start: () => undefined,

        // end: (G: G, ctx: Ctx, from: SquareID, to: SquareID | null) => {
        //     if (to && !sameJSON(from, to)) {
        //         const tmp = G.squares[to.row][to.col];
        //         G.squares[to.row][to.col] = G.squares[from.row][from.col];
        //         G.squares[from.row][from.col] = tmp;
        //     }
        // },

        // Using the BGIO supplied reset function lead to server errros.
        // TO DO: Understand why this happened;
        reset: (G: G /*, ctx: Ctx*/) => {
            G.squares = [...initialSquares];
        },
    },

    board: SwapSquares,
};

export default [ game ];