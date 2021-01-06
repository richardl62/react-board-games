import React from 'react';
import { useDrag } from 'react-dnd';
import { itemTypes } from './constants';
import GameControl, { CorePiece } from '../game-control';
import SimplePiece from '../../piece';

import { nonNull } from '../../tools';
import styles from '../game-layout/game.module.css';

interface PieceProps {
  gameControl: GameControl;
  corePiece: CorePiece;
}

function Piece({ corePiece, gameControl } : PieceProps ) {

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
        if (gameControl.moveable(corePiece.id)) {
          gameControl.clearPiece(corePiece.id);
        }
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
        ref={drag}
        className={nonNull(styles.pieceContainer)}
      >
        <SimplePiece name={corePiece.name} gameType={corePiece.gameType} />
      </div>
    );
  }
}

export default Piece; 
