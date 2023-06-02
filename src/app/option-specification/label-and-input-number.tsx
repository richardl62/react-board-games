import React, { ChangeEvent } from "react";

import styled from "styled-components";

const Input = styled.input`
    width: 6em;
`;

function parseRestrictedInt(str: string, low?: number, high?: number) : number {
    let val = parseInt(str);
    if(isNaN(val)) {
        // KLUDGE? Setting a non-null value allows the high/low testes below// apply
        val = 0; 
    }

    if(low !== undefined && val < low) {
        return low;
    }
    if(high !== undefined && val > high) {
        return high;
    }

    return val;
}

export function labelAndInputNumber(
    value: number,
    setValue: (value: number) => void,
    {label, min, max}: {label: string, min?: number, max?: number},
) : [JSX.Element, JSX.Element] {


    const minMaxText = () => {
        if (min === undefined && max === undefined) {
            return "";
        }

        let txt : string;
        if ( min === undefined ) {
            txt = `<=${max}`;
        } else if ( max === undefined ) {
            txt = `>=${min}`;
        } else {
            txt = `${min}-${max}`;
        }
        
        return ` [${txt}]`;
    }; 

    return [
        <label htmlFor={label} key={label+"label"}> {label + minMaxText()} </label>,
        <Input
            id={label} 
            key={label+"input"}
            type="number"
            defaultValue={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newValue = parseRestrictedInt(e.target.value, min, max);
                setValue(newValue);
            }}
            min={min}
            max={max}
        />
    ];

}
