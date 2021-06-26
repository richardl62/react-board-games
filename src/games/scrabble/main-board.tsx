import { Board, ClickDragState, makeBoardProps } from "../../boards";
import { SquareInteraction } from "../../boards/internal/square";
import { nestedArrayMap } from "../../shared/tools";
import { Tile } from "./tile";
import { Letter } from "./scrabble";
import { squareSize, SquareType, squareTypesArray } from "./square-type";

interface MainBoardProps {
  squareInteraction: SquareInteraction;
  clickDragState: ClickDragState;
  letters: (Letter | null)[][];
}

function squareColor(type: SquareType) : string {
  switch(type) {
    case SquareType.tripleWord:
      return '#e00000';  //darkish red
    case SquareType.doubleWord:
      return '#ff7540';
    case SquareType.tripleLetter:
        return 'blue';
    case SquareType.doubleLetter:
        return 'lightblue';
    case SquareType.simple:
        return '#fff8dc'; // cornsilk
  }
}
const squareColors = nestedArrayMap(squareTypesArray, squareColor);


export function MainBoard({ letters, squareInteraction, clickDragState }: MainBoardProps) {
  const tiles = nestedArrayMap(letters, letter => letter && <Tile letter={letter} />
  );

  const boardProps = makeBoardProps(
    tiles,
    {
      squareBackground: sq => squareColors[sq.row][sq.col],
      externalBorders: true,
      internalBorders: true,
      squareSize: squareSize,
    },
    'mainBoard',
    squareInteraction,
    clickDragState.start
  );


  return <Board {...boardProps} />;
}
