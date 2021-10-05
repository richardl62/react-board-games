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


type PieceID = Record<string, unknown>;

export enum DragType {
    move,
    copy,
    disable,
}

export interface UseDragArg { 
    /** Id of piece to drag. Used as parameter to onDrop.
     * If omitted, the piece will not be draggable.
     */
    id?: PieceID;

    /**
     * The type of dragging: move, copy or none.
     * 
     * Default to move.
     */
    dragType?: DragType;
}

export function useDrag(arg?: UseDragArg):
     [{ isDragging: boolean; }, ReactDnd.ConnectDragSource, ReactDnd.ConnectDragPreview] 
{
    return ReactDnd.useDrag(() => ({
        type: PIECE,
        collect: monitor => {
            return {
                isDragging: Boolean(monitor.isDragging()),
            };
        },

        item: () => {
            if (arg?.dragType !== DragType.disable) {
                return arg?.id;
            }
        },
    }));
}

export interface UseDropArg { 
    onDrop?: (arg: PieceID) => void;
}

export function useDrop(arg?: UseDropArg): 
    [{ isOver: boolean; canDrop: boolean; item: unknown; }, ReactDnd.ConnectDropTarget] 
{
    return ReactDnd.useDrop({
        accept: PIECE,
        drop: (from: PieceID) => arg?.onDrop?.(from),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
            item: monitor.getItem(),
        }),
    });
}