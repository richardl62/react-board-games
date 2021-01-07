import React from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { BoardPosition } from '../../interfaces';
import GameControl, { CorePiece } from '../game-control';
import SimplePiece from '../../piece';

import { nonNull } from '../../tools';
import styles from './game.module.css';

const PIECE = 'piece';

interface ControlledPieceProps {
    gameControl: GameControl;
    corePiece: CorePiece;
  }
  
function ControlledPiece({ corePiece, gameControl } : ControlledPieceProps ) {
  
    const [{ isDragging }, drag ] = useDrag({
      item: {
        type: PIECE,
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
        <div style={{height:"100%", width:"100%"}}
          ref={drag}
        >
          <SimplePiece name={corePiece.name} gameType={corePiece.gameType} />
        </div>
      );
    }
  }

interface ControlledSquareProps {
    gameControl: GameControl, 
    pos: BoardPosition,
};

function ControlledSquare({ gameControl, pos} : ControlledSquareProps )
{
    const [, drop] = useDrop({
        accept: PIECE,
 
        // The use of 'any' below is a kludge.  I am not sure how to type if 
        // properly, or even if proper typing is possible.
        drop: (dragParam: any /* KLUDGE */) => 
        {
            const pieceID : number = dragParam.id;

            if(gameControl.moveable(pieceID)) {
                gameControl.movePiece(pieceID, pos);
            } else {
                gameControl.copyPiece(pieceID, pos);
            }
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })

    const corePiece = gameControl.corePiece(pos);
    return (
        /* pieceContainer sets z-index to 'lift' the piece and so prevents 
            the background being dragged. */
        <div
            className={nonNull(styles.pieceContainer)}
            onClick={() => gameControl.squareClicked(pos)}
            ref={drop}
        >
            {corePiece ? <ControlledPiece 
                corePiece={corePiece} 
                gameControl={gameControl} 
                /> : null
            }
        </div>
    )
}

export {ControlledPiece, ControlledSquare};