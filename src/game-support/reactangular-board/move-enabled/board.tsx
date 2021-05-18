import { ReactNode } from "react";
import { SquareStyle } from "./square";

export interface BoardElement extends SquareStyle {
    elem: ReactNode;
} 

export interface BoardProps<Id = never> {
    pieces: Array<Array<BoardElement>>;
    
    borderLabels?: boolean;
    reverseRows?: boolean;

    gridGap?: string;
    borderWidth?: string;

    colors?: {
        background: string;
        labels: string;
    } 

    Id?: Id;
}