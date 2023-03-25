interface BooleanSpecification  {   
    default: boolean;
    label: string; 
}

interface NumericSpecification {   
    default: number;
    label: string; 
    min?: number;
    max?: number;
}

export type OptionSpecifications = {[arg:string]: BooleanSpecification | NumericSpecification};
export type OptionValues = {[arg:string]: boolean | number};

export type SpecifiedValues<Specs extends OptionSpecifications> = {
    [Property in keyof Specs]: Specs[Property]["default"];
};

export function defaultValues<Specs extends OptionSpecifications>(specs: Specs) : SpecifiedValues<Specs> {
    const defaults = Object.fromEntries(
        Object.entries(specs).map(
            ([k, v]) => [k, v.default]
        ));
    return defaults as SpecifiedValues<Specs>;
}

/** If obj has type SpecifiedValues<Spec> return if as that type.
 * If not, return null.
 */
export function asSpecifiedValues<Spec extends OptionSpecifications>(
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