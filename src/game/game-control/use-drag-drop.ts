import { useDrop, useDrag } from 'react-dnd';
import { PiecePosition, PiecePositionProps } from '../../interfaces';
import GameControl from './game-control';

const PIECE = 'piece';


function useDragRef(gameControl: GameControl, pos: PiecePosition) {
  const changeable = gameControl.squareProperties(pos).changeable;

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
        gameControl.movePieceRequest(pos, null);
      }
    }
  });

  return {
    ref: drag,
    /* Hide the original piece when moving */
    renderPiece: !(isDragging && changeable),
  };
}

function useDropRef(gameControl: GameControl, pos: PiecePosition) {
  const [, drop] = useDrop({
    accept: PIECE,

    // The use of 'any' below is a kludge.  I am not sure how to type if 
    // properly, or even if proper typing is possible.
    drop: (dragParam: any /* KLUDGE */) => {
      const posProps: PiecePositionProps = dragParam.id;
      const from = new PiecePosition(posProps);

      gameControl.movePieceRequest(from, pos);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  })

  return drop;
}


export {useDragRef, useDropRef};
