function nonNull<T>(arg: T) {
  if (arg === null || arg === undefined) {
    throw new Error(`Unexpected null value`);
  } 

  // kludge: The ! asserts that arg is not null.  But why is it needed?
  return arg!; 
}

export { nonNull }