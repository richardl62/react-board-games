import React from 'react';
import { PiecePosition } from '../../interfaces';
import GameControl, { useSquareControl, usePieceControl}
  from '../game-control';
import {Background, CanMoveToMarker} from './square-background'
import Piece from '../../piece';

import styles from "./game-layout.module.css";
import { nonNull } from "../../tools";

interface Props {
  gameControl: GameControl,
  pos: PiecePosition,
};

function ControlledPiece({ gameControl, pos }: Props) {
  const pieceControl = usePieceControl(gameControl, pos);
  const pieceName = gameControl.squareProperties(pos).pieceName
  if (!pieceControl.render || !pieceName) {
    return null;
  }

  return (<div
    className={nonNull(styles.controlledPiece)}
    {...pieceControl.props}
  >
    <Piece
      pieceName={pieceName}
      gameType={gameControl.gameType}
    />
  </div>
  );
}

function Square(props : Props) {
  const { gameControl, pos } = props;

  const squareControl = useSquareControl(gameControl, pos);

  const squareProperties = gameControl.squareProperties(pos);

  return (
    /* ControlledPiece sets z-index to 'lift' the piece and so prevents 
      the background being dragged. */
    <div
      className={nonNull(styles.pieceContainer)}
      {...squareControl.props }
    >
      <Background {...squareProperties} />
      <CanMoveToMarker {...squareProperties} />

      <ControlledPiece {...props} />
    </div>
  )
}

export default Square;
