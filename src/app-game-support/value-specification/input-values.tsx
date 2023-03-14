import React, { useState } from "react";
import styled from "styled-components";
import { InputBoolean } from "./input-boolean";
import { InputNumber } from "./input-number";
import { InputProps, makeInputProps } from "./props";
import { defaultValues, SpecifiedValues } from "./tools";
import { ValueSpecifications } from "./types";

const OuterDiv = styled.div`
    display: flex;
    flex-direction: column;
`;

function makeInput(props: InputProps) {
    const value = props.values[props.valueName];
    if(typeof value === "boolean") {
        return <InputBoolean key={props.valueName} {...props}/>;
    } else {
        return <InputNumber key={props.valueName} {...props}/>;
    }
}

export function InputValues<Spec extends ValueSpecifications>(props: {
    specification: Spec,
    setValues: (values: SpecifiedValues<Spec>) => void,
}) : JSX.Element {
    const {specification, setValues: inputSetValues } = props;
    const [ localValues, setLocalValues ] = useState(defaultValues(specification));

    const inputProps = makeInputProps(specification, localValues, setLocalValues);
    return <OuterDiv>
        {inputProps.map(p => makeInput(p))}
        <button onClick={()=>inputSetValues(localValues)}>Set</button>
    </OuterDiv>;
}