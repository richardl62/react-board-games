import React from 'react';
import { PiecePosition } from '../../interfaces';
import GameControl, { useSquareControl, usePieceControl}
  from '../game-control';
import {Background, CanMoveToMarker} from './square-background'
import Piece from '../../piece';

import styles from "./square.module.css";
import { nonNull } from "../../tools";

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

  return (<div
    className={nonNull(styles.pieceWrapper)}
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
    /* PieceWrapper sets z-index to 'lift' the piece and so prevents 
      the background being dragged. */
    <div
      className={nonNull(styles.square)}
      {...squareControl.props }
    >
      <Background {...squareProperties} />
      <CanMoveToMarker {...squareProperties} />

      <PieceWrapper {...props} />
    </div>
  )
}

export default Square;
