import React from "react";
import styled from "styled-components";
import { SpecifiedValues, ValueSpecifications } from ".";

const ValueTable = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    column-gap: 1em;
`;

export function ShowValues<Spec extends ValueSpecifications>(props: {
    specification: Spec,
    values: SpecifiedValues<Spec>,
}) : JSX.Element {
    const { specification, values } = props;

    const valueText = (key: keyof Spec) => {
        const value = values[key];
        if(typeof value === "boolean") {
            return value ? "true" : "false";
        }
        return value;
    };

    return <ValueTable>
        {Object.keys(specification).map(key => 
            [
                <span key={key}>{specification[key].label}</span>,
                <span key={key+"value"}>{valueText(key)}</span>
            ]
        )}
    
    </ValueTable>;
}