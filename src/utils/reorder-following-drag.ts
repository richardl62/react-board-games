/** Reorder array elements to reflect a drag from 'from' to 'to'.
 * 
 *  Any element between 'from' and 'to' are shuffled up/down as appropriate
 *  (i.e. towards 'from').
 * 
 *  The array is processed in place, and is then returned.
 */

export function reorderFollowingDrag<T>(
    array: T[],
    from: number,
    to: number,
): T[] {

    const dragged = array[from];
    if(from < to) {
        for(let i = from; i < to; ++i) {
            array[i] = array[i+1];
        }
    } else if (from > to) {
        for(let i = from; i > to; --i) {
            array[i] = array[i-1];
        }
    }
    array[to] = dragged;

    return array;
}