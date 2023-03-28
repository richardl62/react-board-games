interface BooleanSpecification  { 
    label: string;   
    default: boolean;

}

interface NumericSpecification {
    label: string;    
    default: number;

    min?: number;
    max?: number;
}

export interface FixedStringSpecification {   
    label: string; 
    default: string; // Must be a member of values.

    options: readonly string[];
}

export type OptionSpecifications = {[arg:string]: BooleanSpecification | NumericSpecification | FixedStringSpecification };
export type OptionValue = boolean | number | string;
export type OptionValues = {[arg:string]: OptionValue};


/*
SpecifiedValues is intended to give a resticted type for FixedStringSpecification and a general for Numbers and booleans.
So with input

const setupOptions = {
    numRows: {
        label: "Number of rows",
        default: 4,
    },
    order: {
        label: "Starting order",
        default: "backwards",
        options: ["forward", "backwards"],
    }
} as const;

The result will be 
{
    numRows: number,
    order: "forward" | "backwards",
}

Note that getting a resticted type for FixedStringSpecification relies on the options being defined using "as const".
*/
type ValueType<T extends BooleanSpecification | NumericSpecification | FixedStringSpecification> = 
    T extends FixedStringSpecification ? T["options"][number] : 
        T["default"] extends number ? number : boolean;

export type SpecifiedValues<Specs extends OptionSpecifications> = {
    [Property in keyof Specs]: ValueType<Specs[Property]>;
};

