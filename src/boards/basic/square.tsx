import React, { ReactNode } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';
import { SquareStyle } from '.';
import { colors as defaultColors } from '../colors';

const PIECE='piece';

type ShowBorder = true | false | 'onHover';
interface StyledSquareProps {
    backgroundColor: string;
    borderColor: string;
    showBorder: ShowBorder;
};

const backgroundColor = (props: StyledSquareProps, hovering: boolean) => {
    const showBorder = props.showBorder === true || 
        (props.showBorder === 'onHover' && hovering);


    return showBorder ? props.borderColor : props.backgroundColor;
}

const StyledSquare = styled.div<StyledSquareProps>`
    display: inline-flex;
    position: relative;
    background-color: ${props => backgroundColor(props, false) };
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

const Element = styled.div<{isDragging: boolean, isDraggedOver: boolean}>`
    width: 100%;
    height: 100%;

    opacity: ${props => props.isDraggedOver ? '0.3' : '1'};
    visibility: ${props => props.isDragging ? 'hidden' : 'inherit'};

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

export interface OnFunctions<T> { // Not quite the right name
    onMouseDown?: (label: T) => void;
    onMouseUp?: (label: T) => void;
    onClick?: (label: T) => void;

    onDrop?: (fromLabel: T, toLabel: T) => void;
    
    /** Called at start of drag. Defaults to always true. */
    allowDrag?: (from: T)=>boolean;
}

export interface SquareProps<T> extends SquareStyle, OnFunctions<T> {
    children: ReactNode;
    label: T;
}


export function Square<Label>(props: SquareProps<Label>) {
    const { children, showHover,
            highlight, label, onClick, onMouseDown, onMouseUp, onDrop } = props;
    const backgroundColor = props.backgroundColor || defaultColors.square;
    const allowDrag = props.allowDrag ?? (()=>true);

    const [{isDragging}, dragRef] = useDrag(() => ({
        type: PIECE,
        collect: monitor => ({
            isDragging: Boolean(monitor.isDragging()),
        }),

        item: () => allowDrag(label) ? label: null,

        //end: (item: any) => console.log('Drag ended', JSON.stringify(item), JSON.stringify(label)),
        
    }),[label])


    const [ dropCollection, dropRef] = useDrop({
        accept: PIECE,
        drop: (from: Label) => onDrop?.(from, label),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
            item: monitor.getItem(),
        }),
    });

    const highlightColor = typeof highlight === 'string'? highlight :
      defaultColors.squareHighlight;

    let showBorder : ShowBorder; 
    let borderColor: string;
    if (typeof showHover === 'string') {
        showBorder = 'onHover';
        borderColor = showHover;
    } else if (showHover === true) {
        showBorder = 'onHover';
        borderColor = defaultColors.squareHover;
    } else {
        showBorder = false;        
        borderColor = "";
    }

    return (
        <StyledSquare
            ref={dropRef}
            backgroundColor={backgroundColor}
            borderColor={borderColor}
            showBorder={showBorder}

            onClick={onClick && (() => onClick(label))}
            onMouseDown={onMouseDown && (() => onMouseDown(label))}
            onMouseUp={onMouseUp && (() => onMouseUp(label))}
        >
            <BorderHelper backgroundColor={backgroundColor} />
            <Element ref={dragRef} 
                isDragging={isDragging}
                isDraggedOver={dropCollection.isOver}
            > 
                {children}
            </Element>
            {highlight? <HighlightMarker color={highlightColor} /> : null }
        </StyledSquare>
    )
}
