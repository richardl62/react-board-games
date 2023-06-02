import React, { ChangeEvent } from "react";
import { sAssert } from "../../utils/assert";

export function labelAndInputFixedString(
    value: string,
    setValue: (value: string) => void,
    {label, options}: {label: string, options: readonly string[]},
) : [JSX.Element, JSX.Element] {

    sAssert(options.includes(value), "String value does not match given options");
    return [
        <label htmlFor={label} key={label+"label"}> {label} </label>,
        <select key={label+"select"} 
            id="pet-select"
            onChange={
                (e: ChangeEvent<HTMLSelectElement>) => setValue(e.target.value)
            }
        >
            {options.map(str => 
                <option key={str} selected={str===value}>{str}</option>
            )}
        </select>
    ];
}


