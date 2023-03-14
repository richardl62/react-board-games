import React, { ChangeEvent } from "react";
import { sAssert } from "../../utils/assert";
import { InputNumberProps } from "./props";

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

// KLUDGE: The props here are an edited copy of the props for InputBoolean
export function InputNumber(props: InputNumberProps) : JSX.Element {
    const { values, setValues, valueName, label, min, max } = props;

    const value = values[valueName];
    sAssert(typeof value === "number");

    const setValue = (newValue: number) => {
        // Use 'any' to avoid typescript error due (I assume) to it's not
        // knowing that newValues[valueName] is a number.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newValues = {...values} as any;
        newValues[valueName] = newValue;
        setValues(newValues);
    };

    const minMaxText = () => {

        if (min === undefined && max === undefined) {
            return "";
        }

        let txt;
        if ( min === undefined ) {
            txt = `<=${max}`;
        } else if ( max === undefined ) {
            txt = `>=${min}`;
        } else {
            txt = `${min}-${max}`;
        }
        
        return `[${txt}] `;
    }; 


    return <label>
        {label+" "+minMaxText()}
        <input
            type="number"
            defaultValue={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newValue = parseRestrictedInt(e.target.value, min, max);
                setValue(newValue);
            }}
            min={min}
            max={max}
        />
    </label>;
}
