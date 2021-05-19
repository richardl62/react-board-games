import React, { ReactNode } from "react";
import { map2DArray } from "../../shared/tools";
import * as Basic from "../basic";
import { BoardProps, SquareID } from "./types";
import { useBasicOnFunctions } from "./make-on-functions";

export interface Element extends Basic.SquareStyle {
    piece: ReactNode;
} 

export function Board(props: BoardProps) {  
    const {id, elements: pieces } = props;

    const basicOnFunctions = useBasicOnFunctions(props);
    
    const basicElements = map2DArray(pieces, 
        (elem, [row,col]) : Basic.Element<SquareID> => {
            const squareID = {row:row, col:col, id:id};
            return {
                ...elem,
                key: `${row}-${col}`,
                label: squareID,
                ...basicOnFunctions
            }
        }
    );

    const basicBoardProps : Basic.BoardProps<SquareID> = {
        ...props,
        elements: basicElements,
    };

    return <Basic.Board {...basicBoardProps} />
}