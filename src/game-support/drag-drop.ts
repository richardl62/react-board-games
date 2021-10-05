import * as DnD from "react-dnd";
const PIECE = "piece";

type PieceID = Record<string, unknown>;

export enum DragType {
    move,
    copy,
    disable,
}

export interface DragDropProps { 
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

    /* Function tp be called on drop.
       If omitted, dragging to this location is disabled.
    */
    onDrop?: (arg: PieceID) => void;
}

export function useDrag(dragDrop?: DragDropProps):
     [{ isDragging: boolean; }, DnD.ConnectDragSource, DnD.ConnectDragPreview] 
{
    return DnD.useDrag(() => ({
        type: PIECE,
        collect: monitor => {
            return {
                isDragging: Boolean(monitor.isDragging()),
            };
        },

        item: () => {
            if (dragDrop?.dragType !== DragType.disable) {
                return dragDrop?.id;
            }
        },
    }));
}

export function useDrop(dragDrop?: DragDropProps): 
    [{ isOver: boolean; canDrop: boolean; item: unknown; }, DnD.ConnectDropTarget] 
{
    return DnD.useDrop({
        accept: PIECE,
        drop: (from: PieceID) => dragDrop?.onDrop?.(from),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
            item: monitor.getItem(),
        }),
    });
}