interface BooleanValueSpecification  {   
    default: boolean;
    label: string; 
}

interface NumericValueSpecification {   
    default: number;
    label: string; 
    min?: number;
    max?: number;
}

export type ValueSpecifications = {[arg:string]: BooleanValueSpecification | NumericValueSpecification};
export type Values = {[arg:string]: boolean | number};

export type SpecifiedValues<Specs extends ValueSpecifications> = {
    [Property in keyof Specs]: Specs[Property]["default"];
};

export function defaultValues<Specs extends ValueSpecifications>(specs: Specs) : SpecifiedValues<Specs> {
    const defaults = Object.fromEntries(
        Object.entries(specs).map(
            ([k, v]) => [k, v.default]
        ));
    return defaults as SpecifiedValues<Specs>;
}
