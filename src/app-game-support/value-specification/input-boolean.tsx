import React from "react";
import { sAssert } from "../../utils/assert";
import { Values } from "./types";

// KLUDGE: The props here are an edited copy of the props for InputNumber
export function InputBoolean(props: {    
    valueName: string;
    label: string;

    values: Values;
    setValues: (arg: Values) => void;
}): JSX.Element {
    const { values, setValues, valueName, label } = props;

    const value = values[valueName];
    sAssert(typeof value === "boolean");

    const toggleValue = () => {
        // Use 'any' to avoid typescript error due (I assume) to it's not
        // knowing that newValues[newValues] is a boolean.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newValues = { ...values } as any;
        newValues[valueName] = !value;
        setValues(newValues);
    };

    return <label>
        {label + " "}
        <input type="checkbox" checked={value} onChange={toggleValue} />
    </label>;
}
