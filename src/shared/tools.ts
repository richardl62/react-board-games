
/** Check is an array of arrays is reactangular in the sense of all rows 
 * having the same length.  Returns true for empty array.
 */
export function isRectangular(arr: any[][]) {
  for(let row = 1; row < arr.length; ++row) {
    if(arr[row].length !== arr[0].length) {
      return false;
    }
  }

  return true;
}

/** map the elements of an array of arrays */
export function nestedArrayMap<T, MappedT>(
  array: Array<Array<T>>,
  func: (elem: T, indices: [number, number]) => MappedT,
  ) : Array<Array<MappedT>> {
  
  let result: Array<Array<MappedT>> = [];

  for(let ind1 = 0; ind1 < array.length; ++ind1) {
    result[ind1] = [];

    for(let ind2 = 0; ind2 < array[ind1].length; ++ind2) {
      const mapped = func(array[ind1][ind2], [ind1, ind2]);
      result[ind1][ind2] = mapped;
    }
  }

  return result;
}

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


/** Return a copy of 'values' with defaults applied to missing elements 
 *  or elements supplied as undefined.
*/
export function applyDefaults<T, D>(values: T, defaults: D) : T & D {
  let result : any = {...values};
  for (let propName in defaults) {
    if (result[propName] === undefined) {
      result[propName] = defaults[propName];
    }
  }

  return result;
}


// const defaults = {a:11, b:22, c:3}; 
// const values1 : {a:number, b?: number}= {a:1, b: undefined};
// const res1 = applyDefaults(values1,defaults);
// let a = res1.a;

// console.log(a,"res1", res1);

// const values2 = {a:1};
// const res2 = applyDefaults(values2,defaults);
// console.log("res1", res2);

//TO DO: Ensure that T1 and T2 overlap.
export function sameJSON<T1,T2>(obj1: T1, obj2: T2): boolean {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
