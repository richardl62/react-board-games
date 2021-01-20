function nonNull(x: any) {
  if (x === null || x === undefined) {
    throw Error(`Unexpected null value`);
  }
  return x;
}

export { nonNull }