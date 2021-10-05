import React, { ReactNode } from "react";

import styled from "styled-components";
import { DragDropProps, useDrag, useDrop } from "./drag-drop";

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


/** Propeties for PieceHolder */
interface PieceHolderProps {
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
     * Note: The child piece (rather than any background or foreground (i.e. the border) is dragged.
    */
    dragDrop?: DragDropProps;
}

/**
 * A good-enough class to contain pieces (or cards etc.) in most of these game.
 * Provides background, highlighting and move functionality.
 */
export function PieceHolder(props: PieceHolderProps): JSX.Element {

    const { hieght, width, background, children, borderColor, dragDrop } = props;

    const [, dragRef] = useDrag(dragDrop);
    const [, dropRef] = useDrop(dragDrop);

    return <Container ref={dropRef} hieght={hieght} width={width} backgroundColor={background.color} borderColor={borderColor}>
        <Piece ref={dragRef}>
            {children}
        </Piece>
    </Container>;
}

