import React from 'react';
import { nonNull } from '../../../shared/tools';
import { GameControl } from '../control';
import { PiecePosition } from '../piece-position';
import { usePieceControl, useSquareControl } from './drag-support';
import { Background, CanMoveToMarker } from './square-background';
import styles from "./square.module.css";
import styled from 'styled-components';

const PieceWrapperStyled = styled.div`
  /* Setting the z-index (which required non-static position) 'lifts' a piece
  and so prevent the background being dragged with it. */
  position: absolute;
  top: 0;
  left: 0;
 
  z-index: 1;

  height: 100%;
  width: 100%;
`;

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

  return (<PieceWrapperStyled
    {...pieceControl.props}
  >
    <Piece pieceName={pieceName} />
  </PieceWrapperStyled>
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