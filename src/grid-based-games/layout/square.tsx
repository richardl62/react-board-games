import React from 'react';
import { GameControl } from '../control';
import { PiecePosition } from '../piece-position';
import { usePieceControl, useSquareControl } from './drag-support';
import { Background, CanMoveToMarker } from './square-background';
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

const SquareStyled = styled.div`
  position: relative;
  width: var(--square-size);
  height: var(--square-size);
`

const SquareStyledUnselected = styled(SquareStyled)`
  &:hover {
    border: 4px solid var(--active-square-highlight, purple);
  }
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
  const Component = squareProperties.gameStatus.selected ? SquareStyled : SquareStyledUnselected; 

  return (
    <Component
      {...squareControl.props}
    >
      <Background {...squareProperties} />
      <CanMoveToMarker {...squareProperties} />

      <PieceWrapper {...props} />
    </Component>
  )
}

export default Square;