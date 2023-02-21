/** Remove dupicated from a sorted array.
 * More precisely, return a copy of the array in which sequences of
 * repeated elements are replaced by a single element.
 * 
 * LIMITIATION: Comparisions are done using === (there is currently no
 * ability to pass in a comparision function)
 */
export function removeDuplicates<T>(arr: T[]) : T[] {
    if(arr.length < 2) {
        return arr;
    }

    const ra = [arr[0]];
    for(let i = 1; i < arr.length; ++i) {
        if(arr[i] !== ra[ra.length - 1]) {
            ra.push(arr[i]);
        }
    }

    return ra;
}

// function test(...args: number[]) {
//     console.log(...args, ":", ...removeDuplicates(args));
// }

// test();
// test(1);
// test(1,1);
// test(1, 2, 2, 2, 1, 3, 3);