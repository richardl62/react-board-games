import * as ReactDnd from "react-dnd";
import { sAssert } from "../assert";
import { sameJSON } from "../same-json";
const PIECE = "piece";

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

/* Note on Drag/drop ID

The IDs passed to useDrag and useDrop are wrapped as {id: user-supplied-id}
before being passed to reactDnD. This allowed the id to be returned cleanly
to client code.  (The ID obtained from useDrag contained some extraneous
members. It looked as if reactDnD data was being merged into the ID object.) 
*/


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
            // Wrap the id. See "Note on Drag/drop ID" above.
            return {id: id};
        },
        end: end && ((dragID : {id: unknown}, monitor) => {
            sAssert(sameJSON(dragID.id, id));
            sAssert(end); // why is this needed?

            const dropResult = monitor.getDropResult();

            let dropID = null;
            if(dropResult) {
                // Unwrap the id. See "Note on Drag/drop ID" above.
                dropID  = (dropResult as {id : ID}).id;
                sAssert(typeof dropID === "object");
            }
            
            sAssert(id);
            end({drag: id, drop: dropID});
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

            // Wrap the id. See "Note on Drag/drop ID" above.
            return {id: id};
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
            item: monitor.getItem(),
        }),
    });
}
