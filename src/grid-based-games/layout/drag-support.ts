import { useDrop /*, useDrag*/ } from 'react-dnd';
import { PiecePosition, makePiecePosition } from '../piece-position';
import GameControl from '../control/game-control/game-control';

const PIECE = 'piece';

function usePieceDrag(gameControl: GameControl, pos: PiecePosition) : any {

  throw new Error("function not implemented");
  // const [{ isDragging }, drag] = useDrag({
  //   item: {
  //     type: PIECE,
  //     id: pos,
  //   },
  //   collect: monitor => ({
  //     isDragging: !!monitor.isDragging(),
  //   }),
  //   end: (item, monitor) => {
  //     if (!monitor.didDrop()) {
  //       // The piece was dragged off the board.
  //       gameControl.onDragEnd(pos, null);
  //     }
  //   }
  // });

  // const squareProps = gameControl.squareProperties(pos); 
  // let render = Boolean(squareProps.pieceName
  //   && !(isDragging && squareProps.changeable)
  // );

  // return {
  //   props: {
  //     ref: drag,
  //   },

  //   render: render,
  // };
}

function useSquareDrag(gameControl: GameControl, pos: PiecePosition) {

  const [, drop] = useDrop({
    accept: PIECE,

    // The use of 'any' below is a kludge.  I am not sure how to type if
    // properly, or even if proper typing is possible.
    drop: (dragParam: any /* KLUDGE */) => {
      // Call makePiecePosition as a sanity check.
      // (It throws an error if given bad input.)
      const from = makePiecePosition(dragParam.id);

      gameControl.onDragEnd(from, pos);
    },
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  })

  return {
    props: {
      ref: gameControl.dragAllowed(pos) ? drop : null,
      onClick: () => gameControl.squareClicked(pos),
    },
  };
}

export { usePieceDrag as usePieceControl, useSquareDrag as useSquareControl };