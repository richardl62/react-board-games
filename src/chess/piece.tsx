import React from 'react';
import { useDrag } from 'react-dnd';
import { itemTypes } from './constants';
import { CorePiece } from './core-piece';
import { BoardControl } from './board-control';

import SVGPiece from 'react-chess-pieces';


interface PieceProps {
  boardControl: BoardControl;
  corePiece: CorePiece;
}

const Piece : React.FC<PieceProps> = ({ corePiece, boardControl }) => {

  const [{ isDragging }, drag ] = useDrag({
    item: {
      type: itemTypes.PIECE,
      id: corePiece.id,
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => boardControl.dragEnd(corePiece.id, monitor.didDrop()),
  });

  if (isDragging && boardControl.dragBehaviour(corePiece.id).move) {
    /* Hide the original piece when moving */
    return null;
  }
  else {
    return (
      <div
        className='piece-div'
        ref={drag}
      >
        <SVGPiece piece={corePiece.name} />
      </div>
    );
  }
}

export { Piece } 