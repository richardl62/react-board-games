/** Rotate the elements of an array to place a given start element first.
 * If start element appears more the once in the array, the first instance is used.
 * An error is thrown the given start element is not part of the array. 
 */
export function rotateArray<T>(array: T[], newStart: T) : void {
    const index = array.indexOf(newStart);
    if(index < 0) {
        throw new Error("rotateArray: given start element is not in array");
    }

    const removed = array.splice(0, index);
    array.splice(array.length, 0, ...removed);
}


// function test(newStart: number) {
//     const array = [11, 22, 33, 44, 55, 66];
//     try {
//         rotateArray(array, newStart);
//         console.log("newStart=",newStart,": ", ...array);
//         if(array[0] !== newStart) {
//             console.warn("Expected first element", newStart, " not found");
//         } 
//     } catch(e) {
//         console.warn(e);
//     }
// }

// test(11);
// test(33);
// test(66);
// test(0);
