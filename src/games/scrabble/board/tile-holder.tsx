import React from "react";
import { DragDrop, PieceHolder, PieceHolderStyle } from "game-support/piece-holder";
import { squareSize, squareBackground, hoverBorderColor, hightlightBorderColor } from "./style";
import { Tile } from "./tile";
import { SquareID } from "../actions/actions";
import { SquareType } from "../config";
import { CoreTile } from "../actions";

interface TileHolderProps {
    tile: CoreTile | null;

    squareType: SquareType;

    squareID: SquareID;

    highlight: boolean;
    showHover: boolean;

    draggable:  boolean;
    onDragEnd?: (arg: {drag: SquareID, drop: SquareID | null}) => void;
    onClick?: () => void;
}


export function TileHolder(props: TileHolderProps): JSX.Element {

    const {tile, squareType, squareID, highlight, showHover, draggable, onDragEnd, onClick } = props;

    const dragDrop : DragDrop<SquareID> = {
        id: squareID,
        draggable: draggable,
        end: onDragEnd,
    };

    const style : PieceHolderStyle = {
        hieght: squareSize,
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
        {tile && <Tile tile={tile} />}
    </PieceHolder>;
}
