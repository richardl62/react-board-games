import React  from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { Board, DragType, makeBoardProps, squareInteractionFunc, MoveFunctions, SquareID } from '../../boards';
import { nestedArrayMap } from '../../shared/tools';
import { AppGame, BoardProps } from '../../shared/types';
import { bb, Piece, pl1, pl2 } from './piece';

const squareSize = '50px';

const Square = styled.div`
    width: ${squareSize};
    height: ${squareSize};
`;
const initialState = {
    pieces: [
        [pl1, pl1, pl1, pl1, pl1],
        [null, null, null, null, null],
        [null, null, bb, null, null],
        [null, null, null, null, null],
        [pl2, pl2, pl2, pl2, pl2],
    ],

    legalMoves: [
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [false, false, false, false, false],
        [true, true, true, true, true],
    ],

    selectedSquare: null,

    gameSpecific: { moveBobailNext: false },
};

type G = typeof initialState;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function BobailBoard({ G, moves }: BoardProps<G>): JSX.Element {

    const pieces = nestedArrayMap(G.pieces, name => {
        const p = name && <Piece pieceName={name} />;
        return <Square>{p}</Square>;
    });

    const moveFunctions: MoveFunctions = {
        dragType: () => DragType.move,
        onMoveEnd: (from: SquareID, to: SquareID | null) => {},
    };

    const boardProps = makeBoardProps({
        pieces: pieces,
        squareBackground: 'white',
        internalBorders: true,
        externalBorders: true,
        squareSize: squareSize,
        boardID: 'bobail',
        squareInteraction: squareInteractionFunc(moveFunctions),
        moveStart: null, //clickDragState.start
    });

    return (<DndProvider backend={HTML5Backend}>
        <Board {...boardProps} />
    </DndProvider>)
}

export const bobail: AppGame =
{
    name: 'bobail',
    displayName: 'Bobail',

    minPlayers: 1,
    maxPlayers: 1,

    moves: {},
    setup: () => initialState,

    board: BobailBoard,
};

