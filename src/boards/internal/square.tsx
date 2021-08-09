import React, { ReactNode } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import styled from 'styled-components';
import { squareSize } from '../../games/scrabble/style';
import { SquareStyle, defaultColors, SquareID } from '../interfaces';

const PIECE='piece';

type ShowBorder = true | false | 'onHover';
interface StyledSquareProps {
    backgroundColor: string;
    borderColor: string;
    showBorder: ShowBorder;
    size: string;
};

const backgroundColor = (props: StyledSquareProps, hovering: boolean) => {
    const showBorder = props.showBorder === true || 
        (props.showBorder === 'onHover' && hovering);


    return showBorder ? props.borderColor : props.backgroundColor;
}

const StyledSquare = styled.div<StyledSquareProps>`
    display: inline-flex;
    position: relative;
    
    //KLUDGE: Hard coded square size
    height: ${props => props.size};
    width: ${props => props.size};
    
    background-color: ${props => backgroundColor(props, false) };
    z-index: 0;

    &:hover {
        background-color: ${props => props.borderColor };
        }
`;

/** KLUDGE: Helps with board margings and adds text  */
const SquareHelper = styled.div<{ backgroundColor: string }>`
    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;

    box-sizing: content-box;
    width: 80%;
    height: 80%;
    margin: 10%;

    font-size: CALC(${squareSize} * 0.5);
    background-color: ${props => props.backgroundColor};

    z-index: 1;
`;

const Element = styled.div<{hidden: boolean, isDraggedOver: boolean}>`
    width: 100%;
    height: 100%;

    opacity: ${props => props.isDraggedOver ? '0.3' : '1'};
    visibility: ${props => props.hidden ? 'hidden' : 'inherit'};

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
export enum DragType {
    move,
    copy,
    disable,
};

export interface SquareInteraction {
    onClick?: () => void;

    /** Called at start of a possible drag. 
     * If omitted dragging is disabled. (This is equivalent to providing a 
     * DragType of disabled). 
     **/
    onDragStart?: () => void;

    /** Should the drag move or copy the piece.
     * Defaults to moving.
     * To Do: Consider making the return value of onDragStart.
     */
    dragType?: DragType;

    /**  Called once for each call to onDragStart (assuming both are supplied).
    * If the drag is successful, there will be an intervening call to onDrop.
    * (Unsuccessful drags occur if the piece is dragged to a non-droppable
    * location.)
    */
    onDragEnd?:() => void;
    
    /* If onDrop is omitted, dropping is prevented */
    onDrop?: (from: SquareID) => void;
}

export interface SquareProps extends SquareStyle, SquareInteraction {
    children: ReactNode;
    label: SquareID;
}

export function Square(props: SquareProps) {
    const { children, background, showHover,
            highlight, label, onClick,
            onDragStart, onDrop, onDragEnd, size 
        } = props;

    const dragType : DragType = props.dragType ?? DragType.disable;

    const [{isDragging}, dragRef] = useDrag(() => ({
        type: PIECE,
        collect: monitor => {
            return {
                isDragging: Boolean(monitor.isDragging()),
            };
        },

        item: () => {
            if(onDragStart && dragType !== DragType.disable) {
		        onDragStart();
            	return label;
             }
        },

        end: (item) => {
            onDragEnd?.();
        },

    }),[label, onDragStart])


    const [ dropCollection, dropRef] = useDrop({
        accept: PIECE,
        drop: (from: SquareID) => onDrop?.(from),
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

    // To do: Use ReactDnD to implement copy vs drag.
    let hidden = isDragging && dragType === DragType.move;
    return (
        <StyledSquare
            ref={dropRef}
            backgroundColor={background.color}
            borderColor={borderColor}
            showBorder={showBorder}
            size={size}

            //onClick={onClick && (() => onClick(label))}
            onClick={onClick && (() => onClick())}
        >
            <SquareHelper backgroundColor={background.color}>
                {background.text}
            </SquareHelper>
            <Element 
                ref={dragRef} 
                hidden={hidden}
                isDraggedOver={dropCollection.isOver}
            > 
                {children}
            </Element>
            {highlight? <HighlightMarker color={highlightColor} /> : null }
        </StyledSquare>
    );
}
