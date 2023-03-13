import { OptionDefinition } from "./types";

export type OptionsClass = {[arg:string]: OptionDefinition};

export type OptionValues<Opts extends OptionsClass> = {
    [Property in keyof Opts]: Opts[Property]["default"];
};

export function defaultValues<Opts extends OptionsClass>(opts: Opts) : OptionValues<Opts> {
    const defaults = Object.fromEntries(
        Object.entries(opts).map(
            ([k, v]) => [k, v.default]
        ));
    return defaults as OptionValues<Opts>;
}
