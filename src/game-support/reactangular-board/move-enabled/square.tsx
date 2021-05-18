import { ReactNode } from "react";

export interface SquareStyle {
    backgroundColor?: string;

    // false -> suppress, true-> default color, string -> specified color;
    showHover?: boolean | string;
    highlight?: boolean | string;
}

export interface SquareProps<T = object> extends SquareStyle {
    children: ReactNode;

    label?: T;
}