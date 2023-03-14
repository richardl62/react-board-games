import { SpecifiedValues } from "./tools";
import { Values, ValueSpecifications } from "./types";

export interface InputBoolProps {
    valueName: string;
    label: string;

    values: Values;
    setValues: (arg: Values) => void;
}

export interface InputNumberProps {
    valueName: string;
    label: string;

    min?: number;
    max?: number;

    values: Values;
    setValues: (arg: Values) => void;
}

export type InputProps = InputBoolProps | InputNumberProps;

export function makeInputProps<Spec extends ValueSpecifications>(
    spec: Spec,
    values: SpecifiedValues<Spec>,
    setValues: (values: SpecifiedValues<Spec>) => void,
    
) : InputProps[] {
    return Object.keys(spec).map(key => {
        const ip: InputProps = {
            valueName: key,
            label: spec[key].label,
            values,
            setValues: (arg: Values) => setValues(arg as SpecifiedValues<Spec>),
        };
        return ip;
    });
}