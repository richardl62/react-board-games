import { useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { Board, ClickDragState, makeBoardProps, makeSquareInteraction, MoveFunctions, SquareID, squareSize } from '../../boards';
import { nestedArrayMap } from '../../shared/tools';
import { AppGame, Bgio } from '../../shared/types';
import { bb, Piece, pl1, pl2 } from './piece';

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

function BobailBoard({ G, moves }: Bgio.BoardProps<G>) {

    const pieces = nestedArrayMap(G.pieces, name => {
        const p = name &&  <Piece pieceName={name}/>;
        return <Square>{p}</Square>;
     });

     const clickDragState = useRef(new ClickDragState()).current;
     const moveFunctions : MoveFunctions = {
        onMoveStart: () => true,
        onMoveEnd: (from: SquareID, to: SquareID | null) => {},
     };
     
     const boardProps = makeBoardProps(
        pieces, 
        'plain',
        'bobail', 
        makeSquareInteraction(moveFunctions, clickDragState), 
        clickDragState.start
    );
 
   return (<DndProvider backend={HTML5Backend}>
       <Board {...boardProps} />
     </DndProvider>)
};

export const bobail : AppGame =
{
    name: 'bobail',
    displayName: 'Bobail',

    minPlayers: 1,
    maxPlayers: 1,

    moves: [],
    setup: () => initialState,

    board: BobailBoard,
};

