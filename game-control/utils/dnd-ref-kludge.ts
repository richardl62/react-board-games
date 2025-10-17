import { ConnectDragSource, ConnectDropTarget } from "react-dnd";

// Used to work-around a type error that occured when using the ref paramters
// returned by useDrag() and useDop() from react-dnd.
// I don't understand why the error occured, but it feels like a type bug
// in react-dnd. (I got the same error when try the react-dnd tutorial example.)
export function dndRefKludge(ref: ConnectDragSource | ConnectDropTarget | null | undefined) : 
    React.RefObject<never> | null | undefined
{
    return ref as unknown as React.RefObject<never>;
}