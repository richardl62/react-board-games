import React from "react";
import { DragDrop, PieceHolder, PieceHolderStyle } from "../../../utils/board/piece-holder";
import { squareSize, squareBackground, hoverBorderColor, hightlightBorderColor } from "./style";
import { SquareID } from "../client-side";
import { SquareType } from "../config";

interface BoardSquareProps {
    content: JSX.Element | null;

    squareType: SquareType;

    squareID: SquareID;

    highlight: boolean;
    showHover: boolean;

    draggable:  boolean;
    onDragEnd?: (arg: {drag: SquareID, drop: SquareID | null}) => void;
    onClick?: () => void;
}

export function BoardSquare(props: BoardSquareProps): JSX.Element {

    const {content, squareType, squareID, highlight, showHover, draggable, onDragEnd, onClick } = props;

    const dragDrop : DragDrop<SquareID> = {
        id: squareID,
        draggable: draggable,
        end: onDragEnd,
    };

    const style : PieceHolderStyle = {
        height: squareSize,
        width: squareSize,

        /** Background color. (In future more general background my me allowed */
        background: squareBackground(squareType),
        borderColor: {
            color: highlight ? hightlightBorderColor : null,
            hoverColor: showHover ? hoverBorderColor : null,
        }
    };

    return <PieceHolder
        style={style}
        dragDrop={dragDrop}
        onClick={onClick}
    >
        {content}
    </PieceHolder>;
}
