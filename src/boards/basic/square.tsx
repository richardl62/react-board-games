import React, { ReactNode } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';
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

export interface SquareStyle {
    backgroundColor?: string;

    // false -> suppress, true-> default color, string -> specified color;
    showHover?: boolean | string;
    highlight?: boolean | string;
}

export interface SquareProps<T> extends SquareStyle {
    children: ReactNode;
    label: T;

    onMouseDown?: (label: T) => void;
    onClick?: (label: T) => void;
    onDrop?: (fromLabel: T, toLabel: T) => void;
}


export function Square<Label>({ children, backgroundColor, showHover,
    highlight, label, onClick, onMouseDown, onDrop }: SquareProps<Label>
    ) {
    const [{isDragging}, dragRef] = useDrag(() => ({
        type: PIECE,
        collect: monitor => ({
            isDragging: Boolean(monitor.isDragging()),
        }),

        item: () => label,

        //end: (item: any) => console.log('Drag ended', JSON.stringify(item), JSON.stringify(label)),
        
    }),[label])

    let drop;
    if( onDrop && label) {
        drop = (from: Label) => onDrop(from, label);
    }

    const [ dropCollection, dropRef] = useDrop({
        accept: PIECE,
        drop: drop,
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
            item: monitor.getItem(),
        }),
    });
    
    backgroundColor = backgroundColor || defaultColors.square;


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
    let baseOnClick;
    if( onClick && label) {
        baseOnClick = () => onClick(label);
    }
    let baseOnMouseDown;
    if( onMouseDown && label) {
        baseOnMouseDown = () => onMouseDown(label);
    }
    return (
        <StyledSquare
            ref={dropRef}
            backgroundColor={backgroundColor}
            borderColor={borderColor}
            showBorder={showBorder}

            onClick={baseOnClick}
            onMouseDown={baseOnMouseDown}
            // onMouseUp={()=>console.log(`MouseUp on ${label}`)}
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
