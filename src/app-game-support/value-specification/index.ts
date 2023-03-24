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

/** If obj has type SpecifiedValues<Spec> return if as that type.
 * If not, return null.
 */
export function toSpecifiedValues<Spec extends ValueSpecifications>(
    obj: unknown,
    spec: Spec,
) : SpecifiedValues<Spec> | null {
    if(typeof obj !== "object") {
        return null;
    }

    const values = obj as SpecifiedValues<Spec>;
    for(const key of Object.keys(spec)) {
        if(typeof values[key] !== typeof spec[key].default) {
            return null;
        }
    }
    return values;
}