import React, { ReactNode } from "react";
import styled from "styled-components";
import {useDrag, useDrop } from "./drag-drop";

type UnknownObject = Record<string, unknown>;

interface BorderColor {
    color?: string | null;
    hoverColor?: string | null;
}


const Container = styled.div<{
    hieght: string,
    width: string,
    backgroundColor?: string | null,
    borderColor?: BorderColor,
}>`
    height: ${props=>props.hieght};
    width: ${props=>props.width};
    background-color: ${props=>props.backgroundColor || "none"};

    position: relative;
    z-index: 0;

    border-style: solid;
    border-width: CALC(${props => props.hieght} * 0.1) CALC(${props => props.width} * 0.1);

    // Quick and dirty handling of undefined color.
    border-color: ${props => props.borderColor?.color || "rgba(0,0,0,0)"};

    :hover {
        // Quick and very dirty handling of undefined color.
        border-color: ${props => props.borderColor?.hoverColor 
            || props.borderColor?.color 
            || "rgba(0,0,0,0)"};
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
    /** Id of piece to drag. Used as parameter to onDrop.
     */
    id: ID;

    /**
     * Called at the start of the a drag.  
     * 
     * 'arg' will be the id supplied in the object.
     * 
     * To Do: Consider adding a return type that could be used to cancel the drag.
     */
    start?: (arg: ID) => void;

    /**
     * Called at the start of the a drag.  
     * 
     * 'arg' will be the id supplied in the object.
     * 
     * 'drop' will be the id of the place holder the object is dropped into, or 
     * null if the drag fails (i.e. if the drag is to a non-droppable location).
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

/** Propeties for PieceHolder */
interface PieceHolderProps<ID = UnknownObject> {
    /** Size of the PieceHolder.
     * The piece will be rendered in a div of this size.
     */ 
    hieght: string;
    width: string;

    /** Background color. (In future more general background my me allowed */
    background: {color: string}


    /** 
     * For now at least, the size of the border is a hard-coded fraction of the size 
     * supplied in this interface.
     */
    borderColor?: BorderColor;

    /** The piece to be displayed. */
    children?: ReactNode;

    onClick?: () => void;

    /** Options for drag and drop 
     * 
     * dragDrap.dragType defaults to move.
     * 
     * Note: The child piece (rather than any background or foreground (i.e. the border) is dragged.
    */
    dragDrop?: DragDrop<ID>;
}

/**
 * A good-enough class to contain pieces (or cards etc.) in most of these game.
 * Provides background, highlighting and move functionality.
 */
export function PieceHolder<ID = UnknownObject>(props: PieceHolderProps<ID>): JSX.Element {

    const { hieght, width, background, children, borderColor, dragDrop } = props;

    const [{isDragging}, dragRef] = useDrag(dragDrop);
    const [, dropRef] = useDrop(dragDrop);


    const hideDuringDrag = dragDrop?.hide !== false;
    const hidePiece = isDragging && hideDuringDrag;

    return <Container ref={dropRef} hieght={hieght} width={width} backgroundColor={background.color} borderColor={borderColor}>
        {<Piece ref={dragRef}>
            {/* Hide the children rather than the Piece.  This avoids so bad behaviour caused, presumably,
             by the piece being unmounted during the drag. */}
            {hidePiece || children}
        </Piece>}
    </Container>;
}

