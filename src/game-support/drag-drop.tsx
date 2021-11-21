import React, { ReactNode } from "react";
import * as ReactDnd from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { sAssert } from "../shared/assert";
import { sameJSON } from "../shared/tools";
const PIECE = "piece";

export function DndProvider(props: {children: ReactNode}): JSX.Element {
    return (
        <ReactDnd.DndProvider backend={HTML5Backend}>
            {props.children}
        </ReactDnd.DndProvider>
    );
}

type UnknownObject = Record<string, unknown>;

interface UseDragArg<ID> {
    /**
     * Called at start of drag.  Returns the Piece ID, or null.
     * If null, the drag is cancelled.
     */
    id: ID;
    start?: (drag: ID) => void,
    end?: (ids: {drag: ID, drop: ID | null}) => void;
}

/**
 * Wrapper for react-dnd useDrag
 * @param arg - [Optional] ID of the piece that can be dragged. Drag is suppress if omitted.
 * 
 * Warning: UseDrag And UseDrop should be give the same type parameter.
 */
export function useDrag<ID = UnknownObject>(arg?: UseDragArg<ID> | null):
     [{ isDragging: boolean; }, ReactDnd.ConnectDragSource, ReactDnd.ConnectDragPreview] 
{
    const {id, start, end} = arg || {};

    // I tried to enforce this in typescript, but got stuck.
    sAssert(id === undefined || typeof id === "object");

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
            
            end({drag: dragID as ID, drop: dropID as ID | null});
        }),
    }));
}
interface UseDropArg<ID = UnknownObject> {
    id: ID,
    onDrop?: (arg: ID) => void,
}
/**
 * Wrapper for react-dnd onDrop
 * @param onDrop - Function to call on drop.
 * 
 * Warning: UseDrag And UseDrop should be give the same type parameter.
 */
export function useDrop<ID = UnknownObject>(arg?: UseDropArg<ID> | null): 
    [{ isOver: boolean; canDrop: boolean; item: unknown; }, ReactDnd.ConnectDropTarget] 
{
    const {id, onDrop} = arg || {};
    
    // I tried to enforce this in typescript, but got stuck.
    sAssert(id === undefined || typeof id === "object");

    return ReactDnd.useDrop({
        accept: PIECE,
        drop: (from: UnknownObject) => {
            if(onDrop) {
                onDrop(from as ID);
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