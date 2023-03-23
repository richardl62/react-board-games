import React, { useState } from "react";
import styled from "styled-components";
import { defaultValues, SpecifiedValues, ValueSpecifications } from ".";
import { InputBoolean } from "./input-boolean";
import { InputNumber } from "./input-number";

const OuterDiv = styled.div`
    display: inline-flex;
    flex-direction: column;
`;

export function InputValues<Spec extends ValueSpecifications>(props: {
    specification: Spec,
    buttonText: string,
    onButtonClick: (values: SpecifiedValues<Spec>) => void,
}) : JSX.Element {
    const {specification, buttonText, onButtonClick } = props;
    const [ localValues, setLocalValues ] = useState(defaultValues(specification));

    const makeInput = (key: keyof Spec) => {
        const spec = specification[key];
        const value = localValues[key];
        
        const setValue = (arg: typeof value) => {
            const newValues = {...localValues};
            newValues[key] = arg;
            setLocalValues(newValues);
        };

        if(typeof value === "boolean") {
            return <InputBoolean key={key.toString()} value={value} setValue={setValue} {... spec} />;
        } else {
            return <InputNumber key={key.toString()} value={value} setValue={setValue} {... spec} />;
        }
    };

    return <OuterDiv>
        {Object.keys(specification).map(key => makeInput(key))}
        <button onClick={()=>onButtonClick(localValues)}>{buttonText}</button>
    </OuterDiv>;
}