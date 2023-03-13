import React, { ChangeEvent } from "react";
import { sAssert } from "../../utils/assert";

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

interface BaseOption<Options> {    
    optionName: keyof Options;
    label: string;

    options: Options;
    setOptions: (arg: Options) => void;
}

type BooleanOption<Options> = BaseOption<Options>;

export function SetBooleanOption<Options>(props: BooleanOption<Options>) : JSX.Element {
    const { options, setOptions, optionName, label } = props;

    const value = options[optionName];
    sAssert(typeof value === "boolean");

    const toggleValue = () => {
        // Use 'any' to avoid typescript error due (I assume) to it's not
        // knowing that newOptions[optionName] is a boolean.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newOptions = {...options} as any;
        newOptions[optionName] = !value;
        setOptions(newOptions);
    };

    return <label>
        {label+" "}
        <input type="checkbox" checked={value} onChange={toggleValue} />
    </label>;
}

interface NumericOption<Options> extends BaseOption<Options> {    
    min?: number;
    max?: number;
}

export function SetNumericOption<Options>(props: NumericOption<Options>) : JSX.Element {
    const { options, setOptions, optionName, label, min, max } = props;

    const value = options[optionName];
    sAssert(typeof value === "number");

    const setValue = (newValue: number) => {
        // Use 'any' to avoid typescript error due (I assume) to it's not
        // knowing that newOptions[optionName] is a number.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newOptions = {...options} as any;
        newOptions[optionName] = newValue;
        setOptions(newOptions);
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
