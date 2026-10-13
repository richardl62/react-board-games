import { sAssert } from '@utils/assert';
import { OptionSpecifications, OptionValues, SpecifiedValues } from './types';

export function defaultValues<Specs extends OptionSpecifications>(
  specs: Specs,
): SpecifiedValues<Specs> {
  const defaults = Object.fromEntries(Object.entries(specs).map(([k, v]) => [k, v.default]));
  return defaults as SpecifiedValues<Specs>;
}

// Extract the values of the options in specs from a (possibly larger) set of values.
// Throws if a value is missing or is of the wrong type.
export function specifiedValues<Specs extends OptionSpecifications>(
  specs: Specs,
  values: OptionValues,
): SpecifiedValues<Specs> {
  const result = Object.fromEntries(
    Object.entries(specs).map(([name, spec]) => {
      const value = values[name];
      sAssert(value !== undefined, `Missing value for option '${name}'`);
      sAssert(typeof value === typeof spec.default, `Unexpected type for option '${name}'`);
      return [name, value];
    }),
  );
  return result as SpecifiedValues<Specs>;
}
