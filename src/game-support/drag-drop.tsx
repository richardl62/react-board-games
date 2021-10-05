import React, { ReactNode } from "react";
import * as ReactDnd from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
const PIECE = "piece";

export function DndProvider(props: {children: ReactNode}): JSX.Element {
    return (
        <ReactDnd.DndProvider backend={HTML5Backend}>
            {props.children}
        </ReactDnd.DndProvider>
    );
}

export type PieceID = Record<string, unknown>;

/**
 * Wrapper for react-dnd useDrag
 * @param id - [Optional] ID of the piece that can be dragged. Drag is suppress if omitted.
 */
export function useDrag(id: PieceID | null | undefined):
     [{ isDragging: boolean; }, ReactDnd.ConnectDragSource, ReactDnd.ConnectDragPreview] 
{
    return ReactDnd.useDrag(() => ({
        type: PIECE,
        collect: monitor => {
            return {
                isDragging: Boolean(monitor.isDragging()),
            };
        },

        item: id && (() => id),
    }));
}

/**
 * Wrapper for react-dnd onDrop
 * @param onDrop - Function to call on drop.
 * @returns 
 */
export function useDrop(onDrop?: (arg: PieceID) => void): 
    [{ isOver: boolean; canDrop: boolean; item: unknown; }, ReactDnd.ConnectDropTarget] 
{
    return ReactDnd.useDrop({
        accept: PIECE,
        drop: (from: PieceID) => onDrop?.(from),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
            item: monitor.getItem(),
        }),
    });
}