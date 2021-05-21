import React, { ReactNode, useRef } from "react";
import { map2DArray } from "../../shared/tools";
import * as Basic from "../basic";
import { BoardProps, SquareID } from "./types";
import { MoveStatus, makeBasicOnFunctions } from "./make-on-functions";

export interface Element extends Basic.SquareStyle {
    piece: ReactNode;
} 

export function Board(props: BoardProps) {  
    const {id, elements: pieces } = props;

    const moveStatus = useRef<MoveStatus>(new MoveStatus()).current;
    const basicOnFunctions = makeBasicOnFunctions(moveStatus, props);
    
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