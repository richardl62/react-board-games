import React from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { PiecePosition, PiecePositionProps, PieceName } from '../../interfaces';
import GameControl from './game-control';
import SimplePiece from '../../piece';
import styles from "./control-square.module.css";
import { nonNull } from "../../tools";

const PIECE = 'piece';

interface ControlledPieceProps {
  gameControl: GameControl;
  pieceName: PieceName;
  pos: PiecePosition;
}

function ControlledPiece({ pieceName, gameControl, pos }: ControlledPieceProps) {
  const moveable = gameControl.positionStatus(pos).moveable;

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: PIECE,
      id: pos.props,
    },
    collect: monitor => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      if (!monitor.didDrop()) {
        // The piece was dragged off the board.
        gameControl.pieceDragged(pos, null);
      }
    }
  });

  if (isDragging && moveable) {
    /* Hide the original piece when moving */
    return null;
  }
  else {
    return (
      <div style={{ height: "100%", width: "100%" }}
        ref={drag}
      >
        <SimplePiece pieceName={pieceName} gameType={gameControl.gameType} />
      </div>
    );
  }
}

interface ControlledSquareProps {
  gameControl: GameControl,
  pos: PiecePosition,
};

function ControlledSquare({ gameControl, pos }: ControlledSquareProps) {
  const [, drop] = useDrop({
    accept: PIECE,

    // The use of 'any' below is a kludge.  I am not sure how to type if 
    // properly, or even if proper typing is possible.
    drop: (dragParam: any /* KLUDGE */) => {
      const posProps: PiecePositionProps = dragParam.id;
      const from = new PiecePosition(posProps);

      gameControl.pieceDragged(from, pos);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  })

  const pieceName = gameControl.positionStatus(pos).pieceName;

  return (
    /* pieceContainer sets z-index to 'lift' the piece and so prevents 
        the background being dragged. */
    <div
      onClick={() => gameControl.squareClicked(pos)}
      ref={drop}
      className={nonNull(styles.pieceContainer)}
    >
      {pieceName ? <ControlledPiece
        pieceName={pieceName}
        gameControl={gameControl}
        pos={pos}
      /> : null
      }
    </div>
  )
}

export default ControlledSquare;
