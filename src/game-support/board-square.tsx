import React, { ReactNode } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';
import { colors as defaultColors } from './colors';

const PIECE='piece';

type ShowBorder = true | false | 'onHover';
interface SquareProps {
    backgroundColor: string;
    borderColor: string;
    showBorder: ShowBorder;
};

const backgroundColor = (props: SquareProps, hovering: boolean) => {
    const showBorder = props.showBorder === true || 
        (props.showBorder === 'onHover' && hovering);


    return showBorder ? props.borderColor : props.backgroundColor;
}

const Square = styled.div<SquareProps>`
    display: inline-flex;
    position: relative;
    background-color: ${props => props.backgroundColor };
    z-index: 0;

    &:hover {
        background-color: ${props => props.borderColor };
        }
`;
const BorderHelper = styled.div<{ backgroundColor: string }>`
    position: absolute;
    top: 0;
    left: 0;    

    box-sizing: content-box;
    width: 100%;
    height: 100%;
        
    width: 80%;
    height: 80%;
    margin: 10%;


    background-color: ${props => props.backgroundColor};

    z-index: 1;
`;

const Element = styled.div`
    width: 100%;
    height: 100%;

    z-index: 2;
`;

const HighlightMarker = styled.div<{color:string}>`
    position: absolute;
    top: 35%;
    left: 35%;

    width: 30%;
    height: 30%;
    z-index: 3;

    border-radius: 50%;

    background-color: ${props => props.color};  
`
export interface BoardSquareProps<T = never> {
    children: ReactNode;

    backgroundColor?: string;

    // false -> suppress, true-> default color, string -> specified color;
    showHover?: boolean | string;
    highlight?: boolean | string;
 
    label?: T;
    onDrop?: (from: T, to: T) => void;
    onClick?: (clicked: T) => void;
}


export function BoardSquare<T>({ children, backgroundColor, showHover, highlight, label, onDrop, onClick }: BoardSquareProps<T>) {

    const [/*{ isDragging } */, dragRef] = useDrag(() => ({
        type: PIECE,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    let drop;
    if( onDrop && label) {
        drop = () => onDrop(label, label);
    }

    const [ /*isDraggedOver*/, dropRef] = useDrop({
        accept: PIECE,
        drop: drop,
        collect: (monitor) => ({
            isDraggedOver: !!monitor.isOver(),
        }),
    });

    backgroundColor = backgroundColor || defaultColors.square;

    const hoverColor = typeof showHover === 'string'? showHover :
      defaultColors.squareHover;
    const highlightColor = typeof highlight === 'string'? highlight :
      defaultColors.squareHighlight;

    let showBorder : ShowBorder; 
    if (showHover) {
        showBorder = 'onHover';
    } else {
        showBorder = false;
    }

    let baseOnClick;
    if( onClick && label) {
        baseOnClick = () => onClick(label);
    }
    return (
        <Square
            ref={dropRef}
            backgroundColor={backgroundColor}
            borderColor={hoverColor}
            showBorder={showBorder}
            onClick={baseOnClick}
        >
            <BorderHelper backgroundColor={backgroundColor} />
            <Element ref={dragRef}> {children} </Element>
            {highlight? <HighlightMarker color={highlightColor} /> : null }
        </Square>
    )
}
