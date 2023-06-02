import React from "react";

export function labelAndInputBoolean(
    value: boolean,
    setValue: (value: boolean) => void,
    {label}: {label: string},
): [JSX.Element, JSX.Element] {

    const toggleValue = () => {
        setValue(!value);
    };

    return [
        <label htmlFor={label} key={label+"label"}> {label}</label>,
        <input id={label} key={label+"input"} type="checkbox" checked={value} onChange={toggleValue} />
    ];
}
