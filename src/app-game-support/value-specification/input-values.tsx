import React, { useState } from "react";
import styled from "styled-components";
import { InputBoolean } from "./input-boolean";
import { InputNumber } from "./input-number";
import { defaultValues, SpecifiedValues } from "./tools";
import { ValueSpecifications } from "./types";

const OuterDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

export function InputValues<Spec extends ValueSpecifications>(props: {
    specification: Spec,
    setValues: (values: SpecifiedValues<Spec>) => void,
}) : JSX.Element {
    const {specification, setValues: inputSetValues } = props;
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
            return <InputBoolean value={value} setValue={setValue} {... spec} />;
        } else {
            return <InputNumber value={value} setValue={setValue} {... spec} />;
        }
    };

    return <OuterDiv>
        {Object.keys(specification).map(key => makeInput(key))}
        <button onClick={()=>inputSetValues(localValues)}>Set</button>
    </OuterDiv>;
}