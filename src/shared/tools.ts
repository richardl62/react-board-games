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
