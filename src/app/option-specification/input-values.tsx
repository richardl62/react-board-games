import React, { useState } from "react";
import styled from "styled-components";
import { defaultValues, SpecifiedValues, ValueSpecifications } from ".";
import { inputBoolean } from "./input-boolean";
import { inputNumber } from "./input-number";

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

export function InputValues<Spec extends ValueSpecifications>(props: {
    specification: Spec,
    buttonText: string,
    onButtonClick: (values: SpecifiedValues<Spec>) => void,
}) : JSX.Element {
    const {specification, buttonText, onButtonClick } = props;
    const [ localValues, setLocalValues ] = useState(defaultValues(specification));

    const labelsAndInputs : JSX.Element[] = [];
    for(const key of Object.keys(specification)) {
        const spec = specification[key];
        const value = localValues[key];

        const setValue = (arg: typeof value) => {
            const newValues = {...localValues};
            newValues[key as keyof Spec] = arg;
            setLocalValues(newValues);
        };

        if(typeof value === "boolean") {
            labelsAndInputs.push(...inputBoolean(value, setValue, spec));

        } else {
            labelsAndInputs.push(...inputNumber(value, setValue, spec));
        }
    }

    return <OuterDiv>
        <LabelAndInputs>{labelsAndInputs}</LabelAndInputs>
        <button onClick={()=>onButtonClick(localValues)}>{buttonText}</button>
    </OuterDiv>;
}