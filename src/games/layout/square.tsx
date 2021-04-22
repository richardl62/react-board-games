import React from 'react';
import { PiecePosition } from '../piece-position';
import { useSquareControl, usePieceControl } from './drag-support'
import { GameControl } from '../control';
import { Background, CanMoveToMarker } from './square-background'

import styles from "./square.module.css";
import { nonNull } from "../../general/tools";

interface Props {
  gameControl: GameControl,
  pos: PiecePosition,
};

function PieceWrapper({ gameControl, pos }: Props) {
  const pieceControl = usePieceControl(gameControl, pos);
  const pieceName = gameControl.squareProperties(pos).pieceName
  if (!pieceControl.render || !pieceName) {
    return null;
  }

  const Piece = gameControl.renderPiece;

  return (<div
    className={nonNull(styles.pieceWrapper)}
    {...pieceControl.props}
  >
    <Piece pieceName={pieceName} />
  </div>
  );
}

function Square(props: Props) {
  const { gameControl, pos } = props;

  const squareControl = useSquareControl(gameControl, pos);

  const squareProperties = gameControl.squareProperties(pos);

  let className = nonNull(styles.square);
  if(!squareProperties.gameStatus.selected) {
    // KLUDGE? Used only to contol hover effect is CSS 
    className += ' ' + nonNull(styles.unselectedSquare) 
  }

  return (
    /* PieceWrapper sets z-index to 'lift' the piece and so prevents
      the background being dragged. */
    <div
      className={className}
      {...squareControl.props}
    >
      <Background {...squareProperties} />
      <CanMoveToMarker {...squareProperties} />

      <PieceWrapper {...props} />
    </div>
  )
}

export default Square;