import { OptionSpecifications, SpecifiedValues } from "./types";

export function defaultValues<Specs extends OptionSpecifications>(specs: Specs): SpecifiedValues<Specs> {
    const defaults = Object.fromEntries(
        Object.entries(specs).map(
            ([k, v]) => [k, v.default]
        ));
    return defaults as SpecifiedValues<Specs>;
}
