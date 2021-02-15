import React from 'react';
import { PiecePosition } from '../game-creation/piece-position';
import GameControl, { useSquareControl, usePieceControl }
  from '../game-creation/game-control';
import { Background, CanMoveToMarker } from './square-background'

import styles from "./square.module.css";
import { nonNull } from "../tools";

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

  return (
    /* PieceWrapper sets z-index to 'lift' the piece and so prevents
      the background being dragged. */
    <div
      className={nonNull(styles.square)}
      {...squareControl.props}
    >
      <Background {...squareProperties} />
      <CanMoveToMarker {...squareProperties} />

      <PieceWrapper {...props} />
    </div>
  )
}

export default Square;