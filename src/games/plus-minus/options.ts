import { SpecifiedValues } from "../../app-game-support/value-specification";
import { sAssert } from "../../utils/assert";

export const gameOptions = {
    startingValue: {
        default: 2,
        label: "Starting value",
        min: 0,
        max: 10,
    },
};

export type GameOptions = SpecifiedValues<typeof gameOptions>;

export function toGameOptions(arg: unknown) : GameOptions {
    const options = arg as GameOptions;
    sAssert(
        typeof options === "object" &&
        typeof options.startingValue === "number", 
        "Problem with starting values"
    );
    return options;
}