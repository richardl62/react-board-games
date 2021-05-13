import React, { ReactNode } from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { colors as defaultColors } from './colors';

const PIECE='piece';

interface BaseProps {
    color: string;
    hoverColor: string;
    isDragging: boolean;
};

const BaseHoverDisabled = styled.div<BaseProps>`
    display: inline-flex;

    position: relative;
    background-color: ${props => props.color};
    z-index: 0;
`;

const BaseHoverEnabled = styled(BaseHoverDisabled)`
    &:hover { 
        background-color: ${props => props.hoverColor}; 
        --hover-helper-display: default;
        }
`;

const HoverHelper = styled.div<{ color: string }>`
    display: var(--hover-helper-display, none);

    position: absolute;
    top: 0;
    left: 0;    

    box-sizing: content-box;
    width: 100%;
    height: 100%;
        
    width: 80%;
    height: 80%;
    margin: 10%;


    background-color: ${props => props.color};

    z-index: 1;
`;

const Element = styled.div`
    width: 100%;
    height: 100%;

    z-index: 2;
`;

const Highlight = styled.div<{color:string}>`
    position: absolute;
    top: 35%;
    left: 35%;

    width: 30%;
    height: 30%;
    z-index: 3;

    border-radius: 50%;

    background-color: ${props => props.color};  
`
export interface BoardSquareProps {
    children: ReactNode;
    
    color?: string;

    // false -> suppress, true-> default color, string -> specified color;
    showHover?: boolean | string;
    highlight?: boolean | string;
 
    onClick?: () => void
}


export function BoardSquare({ children, color, showHover, highlight, onClick }: BoardSquareProps) {
    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: PIECE,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    color = color || defaultColors.square;

    const hoverColor = typeof showHover === 'string'? showHover :
      defaultColors.squareHover;

    const highlightColor = typeof highlight === 'string'? highlight :
      defaultColors.squareHighlight;

    const Base = showHover ? BaseHoverEnabled : BaseHoverDisabled;
    return (
        <Base
            color={color}
            hoverColor={hoverColor}
            isDragging={isDragging}
            onClick={onClick}
        >
            <HoverHelper color={color} />
            <Element ref={dragRef}> {children} </Element>
            {highlight? <Highlight color={highlightColor} /> : null }
        </Base>
    )
}
