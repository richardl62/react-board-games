import React from "react";

export function InputBoolean(props: {
    value: boolean;
    label: string;
 
    setValue: (value: boolean) => void;
}): JSX.Element {
    const { value, setValue,  label } = props;


    const toggleValue = () => {
        setValue(!value);
    };

    return <label>
        {label + " "}
        <input type="checkbox" checked={value} onChange={toggleValue} />
    </label>;
}
