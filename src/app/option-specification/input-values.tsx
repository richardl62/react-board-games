import React, { useState } from "react";
import styled from "styled-components";
import { SpecifiedValues, OptionSpecifications, FixedStringSpecification } from "./types";
import { defaultValues } from "./tools";
import { inputBoolean } from "./input-boolean";
import { inputNumber } from "./input-number";
import { inputFixedString } from "./input-fixed-string";
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

    const inputAndLabel = (key: keyof Spec) => {
        const spec = specification[key];
        const value = localValues[key];

        const setValue = (arg: unknown) => { // Use of unknown is a KLUDGE
            sAssert(typeof arg === typeof value);
            
            const newValues = {...localValues};
            newValues[key as keyof Spec] = arg as typeof value;
            setLocalValues(newValues);
        };

        if (typeof value === "boolean") {
            return inputBoolean(value, setValue, spec);
        } else if (typeof value === "number") {
            return inputNumber(value, setValue, spec);
        } else {
            return inputFixedString(value, setValue, spec as FixedStringSpecification);
        }
    };

    const labelsAndInputs : JSX.Element[] = [];
    for(const key of Object.keys(specification)) {
        const spec = specification[key];

        if(!spec.showIf || spec.showIf(localValues)) {
            labelsAndInputs.push(...inputAndLabel(key));
        }
    }

    return <OuterDiv>
        <LabelAndInputs>{labelsAndInputs}</LabelAndInputs>
        <button onClick={()=>onButtonClick(localValues)}>{buttonText}</button>
    </OuterDiv>;
}