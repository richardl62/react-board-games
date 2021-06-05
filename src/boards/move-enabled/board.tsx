import React, { ReactNode, useRef } from "react";
import { map2DArray } from "../../shared/tools";
import * as Basic from "../basic";
import { BoardProps, SquareID } from "./types";
import { MoveStatus } from "./make-on-functions";
import { SquareStyle } from "../interfaces";

export interface Element extends SquareStyle {
    piece: ReactNode;
} 

export function Board(props: BoardProps) {  
    const {id, elements: pieces } = props;

    const moveStatus = useRef<MoveStatus>(new MoveStatus(props)).current;
    
    const basicElements = map2DArray(pieces, 
        (elem, [row,col]) : Basic.Element<SquareID> => {
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