import React, { ReactNode } from "react";
import styled from "styled-components";

// https://stackoverflow.com/questions/6780614/css-how-to-position-two-elements-on-top-of-each-other-without-specifying-a-hei
const Container = styled.div<{hieght: string, width: string, backgroundColor?: string | null}>`
    height: ${props=>props.hieght};
    width: ${props=>props.width};
    background-color: ${props=>props.backgroundColor || "none"};
    
    display: inline-grid;

    align-items: center;
    justify-items: center;

    /* stack compoments on top of each other. */
    * {
        grid-row: 1;
        grid-column: 1;
    }
`;

export const Border = styled.div<{
        /** Size of the containing div. (Since CSS does not support percentages for boarder sizes.)
         */
        hieght: string, 
        width: string, 

        standardColor: string | null | undefined, 
        hoverColor: string | null | undefined,
    }>`
    display:block;

    height: 100%;
    width: 100%;

    border-style: solid;
    border-width: CALC(${props => props.hieght} * 0.1) CALC(${props => props.width} * 0.1);

    // Quick and dirty handling of undefined color.
    border-color: ${props => props.standardColor || "rgba(0,0,0,0)"};

    :hover {
        // Quick and dirty handling of undefined color.
        border-color: ${props => props.hoverColor || "rgba(0,0,0,0)"};
    }
`;

/** Propeties for PieceHolder */
interface Props {
    /** Size of the PieceHolder.
     * The piece will be rendered in a div of this size.
     */ 
    hieght: string;
    width: string;

    /** Background color. (In future more general background my me allowed */
    background: {color: string}


    /** A border rendered in the foreground. Intended for highlighting. It might cover some of 
     * the piece, but does not affect the space available to render the piece.
     * 
     * For now at least, the size of the border is a hard-coded fraction of the size 
     * supplied in this interface.
     */
    border?: {
        color?: string | null;
        hoverColor?: string | null;
    }

    /** The piece to be displayed. */
    children?: ReactNode;
}

/**
 * A good-enough class to contain pieces (or cards etc.) in most of these game.
 * Provides background, highlighting and move functionality.
 */
export function PieceHolder(props: Props): JSX.Element {

    const { hieght, width, background, children, border } = props;

    return <Container hieght={hieght} width={width} backgroundColor={background.color}>
        {children}
        {border && <Border hieght={hieght} width={width} standardColor={border.color} hoverColor={border.hoverColor}/>}
    </Container>;
}

