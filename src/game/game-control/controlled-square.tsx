import React from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { BoardPosition } from '../../interfaces';
import GameControl, { CorePiece } from '.';
import SimplePiece from '../../piece';
import styles from "./control-square.module.css";
import { nonNull } from "../../tools";

const PIECE = 'piece';

interface ControlledPieceProps {
    gameControl: GameControl;
    corePiece: CorePiece;
    reportClicks?: boolean;
  }
  
function ControlledPiece({ corePiece, gameControl, reportClicks = true }
   : ControlledPieceProps ) {
  
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
          onClick={()=>reportClicks && gameControl.pieceClicked(corePiece)}

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
            onClick={() => gameControl.squareClicked(pos)}
            ref={drop}
            className={nonNull(styles.pieceContainer)}
        >
            {corePiece ? <ControlledPiece 
                corePiece={corePiece} 
                gameControl={gameControl} 

                // Clicks are reported from the containing div.
                //  Don't aslo report them from the ControlledPiece.
                reportClicks={false}
                /> : null
            }
        </div>
    )
}

export {ControlledPiece, ControlledSquare};