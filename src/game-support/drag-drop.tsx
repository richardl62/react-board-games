import React, { ReactNode } from "react";
import * as ReactDnd from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { sAssert } from "shared/assert";
import { sameJSON } from "shared/tools";
const PIECE = "piece";

export function DndProvider(props: {children: ReactNode}): JSX.Element {
    return (
        <ReactDnd.DndProvider backend={HTML5Backend}>
            {props.children}
        </ReactDnd.DndProvider>
    );
}

export type DragDropID = Record<string, unknown>;

interface UseDragArg {
    /**
     * Called at start of drag.  Returns the Piece ID, or null.
     * If null, the drag is cancelled.
     */
    id: DragDropID;
    start?: (drag: DragDropID) => void,
    end?: (ids: {drag: DragDropID, drop: DragDropID | null}) => void;
}
/**
 * Wrapper for react-dnd useDrag
 * @param arg - [Optional] ID of the piece that can be dragged. Drag is suppress if omitted.
 */
export function useDrag(arg?: UseDragArg | null):
     [{ isDragging: boolean; }, ReactDnd.ConnectDragSource, ReactDnd.ConnectDragPreview] 
{
    const {id, start, end} = arg || {};

    return ReactDnd.useDrag(() => ({
        type: PIECE,
        collect: monitor => {
            return {
                isDragging: Boolean(monitor.isDragging()),
            };
        },
        item: () => {
            if(id && start) { 
                start(id); 
            }
            return id;
        },
        end: end && ((dragID : unknown, monitor) => {
            sAssert(sameJSON(dragID, id));
            sAssert(end); // why is this needed?

            const dropID = monitor.getDropResult();
            sAssert(dropID === null || typeof dropID === "object");
            
            end({drag: dragID as DragDropID, drop: dropID as DragDropID | null});
        }),
    }));
}

interface UseDropArg {
    id: DragDropID,
    onDrop?: (arg: DragDropID) => void,
}

/**
 * Wrapper for react-dnd onDrop
 * @param onDrop - Function to call on drop.
 * @returns 
 */
export function useDrop(arg?: UseDropArg | null): 
    [{ isOver: boolean; canDrop: boolean; item: unknown; }, ReactDnd.ConnectDropTarget] 
{
    const {id, onDrop} = arg || {};

    return ReactDnd.useDrop({
        accept: PIECE,
        drop: (from: DragDropID) => {
            if(onDrop) {
                onDrop(from);
            }
            return id;
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
            item: monitor.getItem(),
        }),
    });
}