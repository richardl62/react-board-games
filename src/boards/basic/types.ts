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
