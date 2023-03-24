import { SpecifiedValues } from "../../app-game-support/value-specification";
import { sAssert } from "../../utils/assert";

export const setupOptions = {
    startingValue: {
        default: 2,
        label: "Starting value",
        min: 0,
        max: 10,
    },
};

export type SetupOptions = SpecifiedValues<typeof setupOptions>;

export function toSetupOptions(arg: unknown) : SetupOptions {
    const options = arg as SetupOptions;
    sAssert(
        typeof options === "object" &&
        typeof options.startingValue === "number", 
        "Problem with starting values"
    );
    return options;
}