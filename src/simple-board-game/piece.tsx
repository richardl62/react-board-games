import React from 'react';
import { useDrag } from 'react-dnd';
import { itemTypes } from './constants';
import { CorePiece } from './core-piece';
import { GameControl } from './game-control';

interface PieceProps {
  gameControl: GameControl;
  corePiece: CorePiece;
}

const Piece : React.FC<PieceProps> = ({ corePiece, gameControl }) => {

  const [{ isDragging }, drag ] = useDrag({
    item: {
      type: itemTypes.PIECE,
      id: corePiece.id,
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        // The piece was dragged off the board.
        gameControl.clearPiece(corePiece.id);
        }
    }
  });

  if (isDragging && gameControl.moveable(corePiece.id)) {
    /* Hide the original piece when moving */
    return null;
  }
  else {
    return (
      <div
        className='sbg__piece-div'
        ref={drag}
      >
        {gameControl.makePiece(corePiece.name)}
      </div>
    );
  }
}

export { Piece } 