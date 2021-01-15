import React from 'react';
import {usePieceControl, useSquareControl} from '../game-control';
import { PiecePosition, PieceName } from '../../interfaces';
import GameControl from '../game-control/game-control';
import Backgroud from './square-background'
import SimplePiece from '../../piece';

import styles from "./game-layout.module.css";
import { nonNull } from "../../tools";

interface ControlledPieceProps {
  gameControl: GameControl;
  pos: PiecePosition;
  pieceName: PieceName;
}

function ControlledPiece({ pieceName, gameControl, pos } : ControlledPieceProps) {
  
  const {props, render} = usePieceControl(gameControl, pos);

  if(render) {
    return (
      <div className={nonNull(styles.controlledPiece)}
        {...props}
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

function Square({ gameControl, pos } : ControlledSquareProps) {
  const { props } = useSquareControl(gameControl, pos);

  const squareProperties = gameControl.squareProperties(pos);

  return (
    /* pieceContainer sets z-index to 'lift' the piece and so prevents 
        the background being dragged. */
    <div
      className={nonNull(styles.pieceContainer)}

      {...props }
    >
      <Backgroud
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

export default Square;
