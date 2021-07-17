export const defaultColors = {
    boardBackground: 'rgb(100,0,0)',
    boardBorderLabels: 'white',

    /** Background color for plain (non-checkered) boards */
    square: 'white',
    
    /** Background color for checkered boards */
    blackSquare: 'rgb(165,42,42)',
    /** Background color for checkered boards */
    whiteSquare: 'rgb(255,248,220)',

    moveStart: 'gold',

    squareHover: 'rgb(200 200 100)',
    squareHighlight: 'rgb(83 243 10)', // bright green
};

export interface SquareID {
    row: number;
    col: number;
    boardID: string;
}

export function squareID(row: number, col: number, boardID: string) : SquareID {
    return {
      row: row,
      col: col,
      boardID: boardID,
    }
  }

export interface SquareStyle {
    background: {
        color: string
    };

    // false -> suppress, true-> default color, string -> specified color;
    showHover?: boolean | string;
    highlight?: boolean | string;

    size: string;
}

export interface BoardStyle {
    borderLabels?: boolean;
    reverseRows?: boolean;

    gridGap?: string;
    borderWidth?: string;

    colors?: {
        background: string;
        labels: string;
    };

    squareStyle?: (rc: SquareID) => SquareStyle;
}

