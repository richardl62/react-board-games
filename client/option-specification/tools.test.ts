import { expect, test } from 'vitest';
import { defaultValues, specifiedValues } from './tools';

const specs = {
  numRows: { label: 'Number of rows', default: 4 },
  wrap: { label: 'Wrap', default: false },
  order: { label: 'Order', default: 'forward', options: ['forward', 'backwards'] },
} as const;

test('defaultValues gives the default for each option', () => {
  expect(defaultValues(specs)).toEqual({ numRows: 4, wrap: false, order: 'forward' });
});

test('specifiedValues picks just the specified options', () => {
  const values = { numRows: 6, wrap: true, order: 'backwards', other: 99 };
  expect(specifiedValues(specs, values)).toEqual({ numRows: 6, wrap: true, order: 'backwards' });
});

test('specifiedValues with no specified options gives an empty object', () => {
  expect(specifiedValues({}, { other: 99 })).toEqual({});
});

test('specifiedValues throws if a value is missing', () => {
  expect(() => specifiedValues(specs, { numRows: 6, wrap: true })).toThrow();
});

test('specifiedValues throws if a value has the wrong type', () => {
  expect(() => specifiedValues(specs, { numRows: '6', wrap: true, order: 'forward' })).toThrow();
});
