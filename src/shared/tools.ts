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

// const mapFunc = (x:number, indices: Array<number>) => [x, indices];
// console.log(JSON.stringify(deepArrayMap(arr, mapFunc)));

export function removeUndefined<T>(obj: T) : T {
  for (var propName in obj) {
    if (obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return obj
}


/**  Apply defaults to unspecified elements or elements supplies as undefined. */
export function applyDefaults<T, D>(values: T, defaults: D) {
  return {...defaults, ...removeUndefined({...values})} 
}

// interface A {
//   a?: number;
//   b?: number;
// }
// const d = {a:11, b:22, c:3}; 

// const v1 : A = {a:1, b: undefined};
// const res1 : A = applyDefaults(v1,d);
// console.log("res1", res1);

// const v2 : A = {a:1};
// console.log("res2",applyDefaults(v2,d));

