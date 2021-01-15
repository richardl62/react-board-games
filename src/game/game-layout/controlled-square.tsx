import React from 'react';
import {useDragRef, useDropRef} from '../game-control';
import { PiecePosition, PieceName } from '../../interfaces';
import GameControl from '../game-control/game-control';
import BoardSquare from './board-square'
import SimplePiece from '../../piece';

import styles from "./game-layout.module.css";
import { nonNull } from "../../tools";

interface ControlledPieceProps {
  gameControl: GameControl;
  pos: PiecePosition;
  pieceName: PieceName;
}

function ControlledPiece({ pieceName, gameControl, pos } : ControlledPieceProps) {
  
  const {ref, renderPiece} = useDragRef(gameControl, pos);

  if(renderPiece) {
    return (
      <div className={nonNull(styles.controlledPiece)}
        ref={ref}
      >
        <SimplePiece pieceName={pieceName} gameType={gameControl.gameType} />
      </div>
    );
  } else {
    return null;
  }
}

interface ControlledSquareProps {
  gameControl: GameControl,
  pos: PiecePosition,
};

function ControlledSquare(props: ControlledSquareProps) {
  const { gameControl, pos } = props;
  const ref = useDropRef(gameControl, pos);

  const squareProperties = gameControl.squareProperties(pos);

  return (
    /* pieceContainer sets z-index to 'lift' the piece and so prevents 
        the background being dragged. */
    <div
      onClick={() => gameControl.squareClicked(pos)}
      ref={ref}
      className={nonNull(styles.pieceContainer)}
    >
      <BoardSquare
        background={squareProperties.background}
        selected={squareProperties.gameStatus.selected}
        canMoveTo={squareProperties.gameStatus.canMoveTo}
      />

      {squareProperties.pieceName ? <ControlledPiece
        pieceName={squareProperties.pieceName}
        gameControl={gameControl}
        pos={pos}
      /> : null
      }
    </div>
  )
}

export default ControlledSquare;
