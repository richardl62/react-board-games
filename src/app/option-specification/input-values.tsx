import React, { useState } from "react";
import styled from "styled-components";
import { SpecifiedValues, OptionSpecifications, FixedStringSpecification } from "./types";
import { defaultValues } from "./tools";
import { labelAndInputBoolean } from "./label-and-input-boolean";
import { labelAndInputNumber } from "./label-and-input-number";
import { labelAndInputFixedString } from "./label-and-input-fixed-string";
import { sAssert } from "../../utils/assert";

const OuterDiv = styled.div`
    display: inline-flex;
    flex-direction: column;
`;

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

export function InputValues<Spec extends OptionSpecifications>(props: {
    specification: Spec,
    buttonText: string,
    onButtonClick: (values: SpecifiedValues<Spec>) => void,
}) : JSX.Element {
    const {specification, buttonText, onButtonClick } = props;
    const [ localValues, setLocalValues ] = useState(defaultValues(specification));

    const inputAndLabel = (key: keyof Spec, debugOnly: boolean) => {
        const spec = specification[key];
        const value = localValues[key];

        if (Boolean(spec.debugOnly) !== debugOnly) {
            return [];
        }

        if(spec.debugOnly && !localValues.showDebugOptions) {
            return [];
        }

        if(spec.showIf && !spec.showIf(localValues)) {
            return [];
        }

        const setValue = (arg: unknown) => { // Use of unknown is a KLUDGE
            sAssert(typeof arg === typeof value);
            
            const newValues = {...localValues};
            newValues[key as keyof Spec] = arg as typeof value;
            setLocalValues(newValues);
        };

        if (typeof value === "boolean") {
            return labelAndInputBoolean(value, setValue, spec);
        } else if (typeof value === "number") {
            return labelAndInputNumber(value, setValue, spec);
        } else {
            return labelAndInputFixedString(value, setValue, spec as FixedStringSpecification);
        }
    };

    return <OuterDiv>
        <LabelAndInputs>
            {Object.keys(specification).map(key => inputAndLabel(key, false))}
            {Object.keys(specification).map(key => inputAndLabel(key, true))}
        </LabelAndInputs>
        <button onClick={()=>onButtonClick(localValues)}>{buttonText}</button>
    </OuterDiv>;
}