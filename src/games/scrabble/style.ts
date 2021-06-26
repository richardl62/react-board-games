import { SquareType } from "./square-type";

export const squareSize = '30px';

export function squareColor(type: SquareType) : string {
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

  export const tileBackgroundColor = "brown";
  export const tileTextColor = "white";