// Code taken from ChatGPT
// https://chatgpt.com/share/68ee1d40-ab90-8009-9eb1-41334e584801
export type Equal<T, U> =
  (<G>() => G extends T ? 1 : 2) extends
  (<G>() => G extends U ? 1 : 2) ? true : false;

export function assertType<_T extends true>() {}

/* Example usage:
type T1 = ...;
type T2 = ...;

assertType<Equal<T1, T2>>(); 

Gives 
    Error: Type 'false' does not satisfy the constraint 'true'
if the types are not equal.
*/
