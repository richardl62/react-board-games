import React, { ReactNode, useRef } from "react";
import { map2DArray } from "../../shared/tools";
import * as Basic from "../basic";
import { BoardProps, SquareID } from "./types";
import { ClickDrag } from "./click-drag";
import { SquareStyle } from "../interfaces";

export interface Element extends SquareStyle {
    piece: ReactNode;
} 

export function Board(props: BoardProps) {  
    const {id, elements: pieces } = props;

    const moveStatus = useRef<ClickDrag>(new ClickDrag(props)).current;
    
    const basicElements = map2DArray(pieces, 
        (elem, [row,col]) : Basic.BoardElement<SquareID> => {
            const squareID = {row:row, col:col, id:id};
      
            return {
                ...elem,
                key: `${row}-${col}`,
                label: squareID,
                ...moveStatus.basicOnFunctions()
            }
        }
    );

    const basicBoardProps : Basic.BoardProps<SquareID> = {
        ...props,
        elements: basicElements,
    };

    return <Basic.Board {...basicBoardProps} />
}