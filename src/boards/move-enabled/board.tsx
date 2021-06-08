import React, { ReactNode, useRef } from "react";
import { map2DArray } from "../../shared/tools";
import * as Basic from "../basic";
import { BoardProps } from "./types";
import { ClickDrag } from "../basic/click-drag";
import { SquareStyle } from "../interfaces";

export interface Element extends SquareStyle {
    piece: ReactNode;
} 

export function MoveEnabledBoard(props: BoardProps) {  
    const {elements: pieces } = props;

    const clickDrag = useRef(new ClickDrag(props)).current;
    
    const basicElements = map2DArray(pieces, 
        (elem, [row,col]) : Basic.BoardElement => {
            return {
                ...elem,
                ...clickDrag.basicOnFunctions()
            }
        }
    );

    const basicBoardProps : Basic.BoardProps = {
        ...props,
        elements: basicElements,
    };

    return <Basic.Board {...basicBoardProps} />
}