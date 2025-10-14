
import { SpecifiedValues } from "../../app/option-specification/types";
import { defaultValues } from "../../app/option-specification/tools";

export const setupOptions = {
    timeToMakeGrid: {
        default: 60,
        label: "Time to make grid",
    }, 
    makeGridCountdown: {
        default: 5,
        label: "Make grid countdown",
    },
    rackSize: {
        default: 8,
        label: "Rack size",
        min: 6,
        max: 8,
    },
    minVowels: {
        default: 2,
        label: "Min vowels",
        min: 0,
        max: 2,
    },
    minConsonants: {
        default: 4,
        label: "Min consonsants",
        min: 0,
        max: 4,
    },
    minBonusLetters: {
        default: 0,
        label: "Min bonus letters",
        min: 0,
        max: 2,
    },
    playersGetSameLetters: {
        default: true,
        label: "Players get same letters",
    },
    checkGridBeforeRecoding: {
        default: true,
        label: "Warn when recording non-scoring grid"
    },
    checkSpelling: {
        default: true,
        label: "Check spelling",
    }
};

export type SetupOptions = SpecifiedValues<typeof setupOptions>;

export const defaultOptions : SetupOptions = defaultValues(setupOptions);

