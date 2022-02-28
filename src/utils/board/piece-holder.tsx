import React, { ReactNode } from "react";
import styled from "styled-components";
import {useDrag, useDrop } from "./drag-drop";

type UnknownObject = Record<string, unknown>;

interface BorderColor {
    color?: string | null;
    hoverColor?: string | null;
}

const Container = styled.div<{
    height: string,
    width: string,
    color?: string | null,
    backgroundColor?: string | null,
}>`
    display: flex;
    align-items: center;
    justify-content: center;

    height: ${props=>props.height};
    width: ${props=>props.width};
    color: ${props=>props.color || "none"};
    background-color: ${props=>props.backgroundColor || "none"};

    position: relative;
    z-index: 0;
`;

const FullSize = styled.div`
    width: 100%;
    height: 100%;
`;

function nonHoverBorderColor(bc?: BorderColor) : string {
    if(bc?.color) {
        return bc.color;
    }

    return "transparent";
}

function hoverBorderColor(bc?: BorderColor) : string {
    if(bc?.hoverColor) {
        return bc.hoverColor;
    }

    return nonHoverBorderColor(bc);
}

const Border = styled.div<{
    height: string,
    width: string,
    borderColor?: BorderColor,
}>`
    height: ${props=>props.height};
    width: ${props=>props.width};
    color: ${props=>props.color || "none"};

    position: absolute;
    top:0;
    left:0;

    z-index: 2;

    border-style: solid;
    border-width: CALC(${props => props.height} * 0.1) CALC(${props => props.width} * 0.1);


    border-color: ${props => nonHoverBorderColor(props.borderColor)};

    :hover {
        border-color: ${props => hoverBorderColor(props.borderColor)};
    }
`;

const Piece = styled.div`
    display: grid;
    align-items: center;
    justify-items: center;

    position: absolute;
    top:0;
    left:0;
    height: 100%;
    width: 100%;
    z-index: 1;
`;

export interface DragDrop<ID = UnknownObject> { 
    /** Id of piece to drag. Used as parameter to start and end.*/
    id: ID;

    /** Determine whether the piece is dragable */
    draggable: boolean;

    /**
     * Called at the start of the a drag.  
     * 
     * 'id' will be the id supplied in this object.
     */
    start?: (id: ID) => void;

    /**
     * Called at the end of the a drag.  
     * 
     * 'drag' will be the id supplied in this object.
     * 
     * 'drop' will be the id of the place holder the object that is dropped into,
     * or null if the drag fails (i.e. if the drag is to a non-droppable location).
     * 
     * To Do: Consider adding a return type that could be used to cancel the drag.
     */
    end?: (arg: {drag: ID, drop: ID | null}) => void;

    /** Specify whether the original piece is hiden during the drag (so whether
     * the drag appears to move or copy the piece)
     * 
     * The default is to hide. 
     */
    hide?: boolean;
}

export interface PieceHolderBackground {
    color: string,
    text?: string,
    textColor?: string,
}

export interface PieceHolderStyle {
    /** Size of the PieceHolder.
     * The piece will be rendered in a div of this size.
     */
    height: string;
    width: string;

    /** Background color. (In future more general background may be allowed */
    background: PieceHolderBackground;

    /** 
     * Specify the colour of the border.
     * 
     * For now at least, the size of the border is a hard-coded fraction of the size 
     * supplied in this interface.
     */
    borderColor?: BorderColor;
}

/** Propeties for PieceHolder */
interface PieceHolderProps<ID = UnknownObject> {
    style: PieceHolderStyle;

    onClick?: () => void;

    /** Options for drag and drop 
     * 
     * dragDrap.dragType defaults to move.
     * 
     * Note: The child piece (rather than any background or foreground (i.e. the border) is dragged.
    */
    dragDrop?: DragDrop<ID>;

    /** The piece to be displayed. */
    children?: ReactNode;
}

/**
 * A good-enough class to contain pieces (or cards etc.) in most of these game.
 * Provides background, highlighting and move functionality.
 */
export function PieceHolder<ID = UnknownObject>(props: PieceHolderProps<ID>): JSX.Element {

    const { style, children, onClick, dragDrop } = props;
    const { height, width, background, borderColor } = style;
    const draggable = dragDrop ? dragDrop.draggable : false;

    const [{isDragging}, dragRef] = useDrag(dragDrop);
    const [, dropRef] = useDrop(dragDrop);


    const hideDuringDrag = dragDrop?.hide !== false;
    const hidePiece = isDragging && hideDuringDrag;

    return <Container ref={dropRef}
        height={height}
        width={width}
        color={background?.textColor}
        backgroundColor={background?.color}
        onClick={onClick}
    >
        {background.text}

        {/* KLUDGE: Drag the piece and the border.  This is done because the 
        border is on top of the piece (to make it visible), and without this
        kludge the border would block the drag.    
        */}
        <FullSize ref={draggable ? dragRef : undefined}>
            <Piece >
                {/* Hide the children rather than the Piece.  This avoids so bad behaviour caused, presumably,
             by the piece being unmounted during the drag. */}
                {hidePiece || children}
            </Piece>

            <Border
                height={height}
                width={width}
                borderColor={borderColor}
            />
        </FullSize>
        
    </Container>;
}

