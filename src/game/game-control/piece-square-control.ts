import { useDrop, useDrag } from 'react-dnd';
import { PiecePosition } from '../../interfaces';
import GameControl from './game-control';

const PIECE = 'piece';

function usePieceControl(gameControl: GameControl, pos: PiecePosition) {

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: PIECE,
      id: pos.data,
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

  const squareProps = gameControl.squareProperties(pos);
  let render = Boolean(squareProps.pieceName
    && !(isDragging && squareProps.changeable)
  );

  return {
    props: {
      ref: drag,
    },

    render: render,
  };
}

function useSquareControl(gameControl: GameControl, pos: PiecePosition) {

  const [, drop] = useDrop({
    accept: PIECE,

    // The use of 'any' below is a kludge.  I am not sure how to type if
    // properly, or even if proper typing is possible.
    drop: (dragParam: any /* KLUDGE */) => {
      const from = new PiecePosition(dragParam.id);

      gameControl.movePieceRequest(from, pos);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  })

  return {
    props: {
      ref: drop,
      onClick: () => gameControl.squareClicked(pos),
    },
  };
}

export { usePieceControl, useSquareControl };
