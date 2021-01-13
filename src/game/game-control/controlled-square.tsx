import React from 'react';
// import { useDrop, useDrag } from 'react-dnd';
import { BoardPosition, PieceName } from '../../interfaces';
import GameControl from './game-control';
import SimplePiece from '../../piece';
import styles from "./control-square.module.css";
import { nonNull } from "../../tools";

// const PIECE = 'piece';

interface ControlledPieceProps {
    gameControl: GameControl;
    pieceName: PieceName;
    reportClicks?: boolean;
  }
  
function ControlledPiece({ pieceName, gameControl, reportClicks = true }
   : ControlledPieceProps ) {
  
    // const [{ isDragging }, drag ] = useDrag({
    //   item: {
    //     type: PIECE,
    //     id: piece.id,
    //   },
    //   collect: monitor => ({
    //     isDragging: !!monitor.isDragging(),
    //   }),
    //   end: (item, monitor) => {
    //     if (!monitor.didDrop()) {
    //       // The piece was dragged off the board.
    //       if (gameControl.moveable(piece)) {
    //         gameControl.clearPiece(piece);
    //       }
    //     }
    //   }
    // });
  
    // if (isDragging && gameControl.moveable(piece)) {
    //   /* Hide the original piece when moving */
    //   return null;
    // }
    // else {
      return (
        <div style={{height:"100%", width:"100%"}}
        //   ref={drag}
        //   onClick={()=>reportClicks && gameControl.pieceClicked(piece)}

        >
          <SimplePiece pieceName={pieceName} gameType={gameControl.gameType} />
        </div>
      );
    // }
}
 
interface ControlledSquareProps {
    gameControl: GameControl, 
    pos: BoardPosition,
};

function ControlledSquare({ gameControl, pos} : ControlledSquareProps )
{
    // const [, drop] = useDrop({
    //     accept: PIECE,
 
    //     // The use of 'any' below is a kludge.  I am not sure how to type if 
    //     // properly, or even if proper typing is possible.
    //     drop: (dragParam: any /* KLUDGE */) => 
    //     {
    //         const piece = gameControl.findPiece(dragParam.id);

    //         if(gameControl.moveable(piece)) {
    //             gameControl.movePiece(piece, pos);
    //         } else {
    //             gameControl.copyPiece(piece, pos);
    //         }
    //     },
    //     collect: monitor => ({
    //         isOver: !!monitor.isOver(),
    //     }),
    // })

    const pieceName = gameControl.positionStatus(pos).pieceName;

    return (
        /* pieceContainer sets z-index to 'lift' the piece and so prevents 
            the background being dragged. */
        <div
            onClick={() => gameControl.squareClicked(pos)}
            // ref={drop}
            className={nonNull(styles.pieceContainer)}
        >
            {pieceName ? <ControlledPiece 
                pieceName={pieceName} 
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
