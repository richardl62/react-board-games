import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { defaultColors } from './interfaces';
import { BoardProps, Element } from './move-enabled';
import { ClickDrag } from './basic/click-drag';

export function checkeredColor(row: number, col: number, options?: {moveStart: boolean}) {
  if (options?.moveStart) {
    return 'gold';
  }

  const asTopLeft = (row + col) % 2 === 0;
  return asTopLeft ? defaultColors.whiteSquare : defaultColors.blackSquare;
}

const squareSize = '50px';
const StyledSquare = styled.div`
  height: ${squareSize};
  width: ${squareSize};
`

export function checkedBoardProps (
  pieces: Array<Array<ReactNode>>,
  moveStatus?: ClickDrag,
): BoardProps {

  const elements = pieces.map(
    (row, rowNum) =>
      row.map(
        (piece, colNum): Element => {
          return {
            piece: <StyledSquare>{piece}</StyledSquare>,
            backgroundColor: checkeredColor(rowNum, colNum),
          }
        }
      )
  )
  
  const styleProps = {
    elements: elements,
    borderLabels: true,
    borderWidth: `calc(${squareSize} / 2)`
  }

  return styleProps;
}