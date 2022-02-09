// const arr = [
//   [],
//   [1],
//   [2,3,4],
// ];
// console.log('array');
// for(let inner of arr) {
//   console.log(JSON.stringify(inner));
// }
// const mappedArr = map2DArray(arr, (x, indices) => [indices, 10*x]);
// console.log('mapped array');
// for(let inner of mappedArr) {
//   console.log(JSON.stringify(inner));
// }
//TO DO: Ensure that T1 and T2 overlap.

export function sameJSON<T1, T2>(obj1: T1, obj2: T2): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}
