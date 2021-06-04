export const defaultColors = {
    boardBackground: 'rgb(100,0,0)',
    boardBorderLabels: 'white',
    
    square: 'white',
    blackSquare: 'rgb(165,42,42)',
    whiteSquare: 'rgb(255,248,220)',

    squareHover: 'rgb(200 200 100)',
    squareHighlight: 'rgb(83 243 10)', // bright green
};

export interface RowCol {
    row: number;
    col: number;
}
export interface SquareStyle {
    backgroundColor?: string;

    // false -> suppress, true-> default color, string -> specified color;
    showHover?: boolean | string;
    highlight?: boolean | string;
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

    squareStyle?: (rc: RowCol) => SquareStyle;
}

