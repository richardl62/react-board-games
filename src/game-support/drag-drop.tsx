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

interface UseDragArg {
    /**
     * Called at start of drag.  Returns the Piece ID, or null.
     * If null, the drag is cancelled.
     */
    id: PieceID | null;
    end?: () => void;
}
/**
 * Wrapper for react-dnd useDrag
 * @param arg - [Optional] ID of the piece that can be dragged. Drag is suppress if omitted.
 */
export function useDrag(arg: UseDragArg):
     [{ isDragging: boolean; }, ReactDnd.ConnectDragSource, ReactDnd.ConnectDragPreview] 
{
    return ReactDnd.useDrag(() => ({
        type: PIECE,
        collect: monitor => {
            return {
                isDragging: Boolean(monitor.isDragging()),
            };
        },
        item: arg.id,
        end: (endArg : unknown, monitor) => console.log("argDrag: from" , arg.id, "to ", monitor.getDropResult()),
    }));
}

interface UseDropArg {
    onDrop?: (arg: PieceID) => void,
    id: PieceID | null,
}

/**
 * Wrapper for react-dnd onDrop
 * @param onDrop - Function to call on drop.
 * @returns 
 */
export function useDrop(arg: UseDropArg): 
    [{ isOver: boolean; canDrop: boolean; item: unknown; }, ReactDnd.ConnectDropTarget] 
{
    return ReactDnd.useDrop({
        accept: PIECE,
        drop: (from: PieceID) => {
            arg.onDrop && arg.onDrop(from);
            return arg.id;
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
            item: monitor.getItem(),
        }),
    });
}