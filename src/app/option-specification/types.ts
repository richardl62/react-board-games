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

    options: string[];
}

export type OptionSpecifications = {[arg:string]: BooleanSpecification | NumericSpecification | FixedStringSpecification };
export type OptionValue = boolean | number | string;
export type OptionValues = {[arg:string]: OptionValue};

export type SpecifiedValues<Specs extends OptionSpecifications> = {
    [Property in keyof Specs]: Specs[Property]["default"];
};

