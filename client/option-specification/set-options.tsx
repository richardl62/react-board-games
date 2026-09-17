import { JSX } from 'react';
import styled from 'styled-components';
import { SpecifiedValues, OptionSpecifications, FixedStringSpecification } from './types';
import { labelAndInputBoolean } from './label-and-input-boolean';
import { labelAndInputNumber } from './label-and-input-number';
import { labelAndInputFixedString } from './label-and-input-fixed-string';
import { sAssert } from '@utils/assert';

const LabelAndInputs = styled.div`
  display: inline-grid;
  column-gap: 0.25em;
  grid-template-columns: auto auto;

  input {
    justify-self: start;
  }
  label {
    justify-self: end;
  }
`;

// Component to set options defined by an OptionSpecifications.
export function SetOptions<Spec extends OptionSpecifications>({
  specification,
  options,
  setOptions,
}: {
  specification: Spec;
  options: SpecifiedValues<Spec>;
  setOptions: (options: SpecifiedValues<Spec>) => void;
}): JSX.Element {
  const inputAndLabel = (key: keyof Spec, debugOnly: boolean) => {
    const spec = specification[key];
    const value = options[key];

    if (Boolean(spec.debugOnly) !== debugOnly) {
      return [];
    }

    if (spec.debugOnly && !options.showDebugOptions) {
      return [];
    }

    if (spec.showIf && !spec.showIf(options)) {
      return [];
    }

    // Use of unknown is a KLUDGE
    const doSetValue = (arg: unknown) => {
      sAssert(typeof arg === typeof value);

      const newOptions = { ...options };
      newOptions[key] = arg as typeof value;
      setOptions(newOptions);
    };

    if (typeof value === 'boolean') {
      return labelAndInputBoolean(value, doSetValue, spec);
    } else if (typeof value === 'number') {
      return labelAndInputNumber(value, doSetValue, spec);
    } else {
      return labelAndInputFixedString(value, doSetValue, spec as FixedStringSpecification);
    }
  };

  return (
    <LabelAndInputs>
      {Object.keys(specification).map((key) => inputAndLabel(key, false))}
      {Object.keys(specification).map((key) => inputAndLabel(key, true))}
    </LabelAndInputs>
  );
}
