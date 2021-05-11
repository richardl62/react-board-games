import { useState } from 'react';

interface StatePromiseData<T> {
  state: 'unset' | 'pending' | 'fulfilled';
  value?: T;
}

// Warning: No error handling done here.
export function useStatePromise<T>(inputVal: T | null = null) {
  const [data, setData] = useState<StatePromiseData<T>>(
    inputVal? {state: 'fulfilled', value: inputVal} : {state: 'unset'}
  );

  const set = (val: T) => {
      setData({state: 'fulfilled', value: val});
   };

  const get = () => {
      // The two test below should always give the same result.
      if(data.state !== 'fulfilled' || data.value === undefined) {  
        throw new Error("Value is not ready");
      }

      return data.value;
  };

  return {
    unset: data.state === 'unset',
    pending: data.state === 'pending',
    fulfilled: data.state === 'fulfilled',

    get value() { return get(); },

    set value(val: T) { set(val);},

    setPromise: (p: Promise<T>) => {
      setData({state: 'pending'});
      p.then(set);
      return p;
    },
  }
}

function doDeepMap(
  item: any, 
  currentIndices: Array<number>,
  // itemAction is applied to leaf (non-array) elements
  itemAction: (e:any, indices: Array<number>) => any
) : any {

  if(!(item instanceof Array)) {
    return itemAction(item, currentIndices);
  }

  return item.map((nestedItem: any, index: number) =>
    doDeepMap(nestedItem, [...currentIndices, index], itemAction)
  );
}

export function deepArrayMap(
  item: any,
  itemAction: (e:any, indices: Array<number>) => any
  ) {
  return doDeepMap(item, [], itemAction);
}

export function deepCopyArray<T>(arr: T) : T {
  return deepArrayMap(arr, (item:any) => item);  
}


// const arr = [
//   0,
//   [1,2,3],
//   [4,5,
//     [6],
//   ],
// ];

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
