import { OptionSpecifications, SpecifiedValues } from "./types";

export function defaultValues<Specs extends OptionSpecifications>(specs: Specs): SpecifiedValues<Specs> {
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
    spec: Spec
): SpecifiedValues<Spec> | null {
    if (typeof obj !== "object") {
        return null;
    }

    const values = obj as SpecifiedValues<Spec>;
    for (const key of Object.keys(spec)) {
        if (typeof values[key] !== typeof spec[key].default) {
            return null;
        }
    }
    return values;
}
