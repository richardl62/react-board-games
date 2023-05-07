import { SpecifiedValues } from "../../../app/option-specification/types";

export const setupOptions = {
    mainPileSize: {
        label: "Size of players' piles",
        default: 24,
        min: 1,
    },
    nSharedPilesAtStart: {
        label: "No of shared piles at start",
        default: 6, // TEMPORARY
        min: 0,
    },
    addToSharedPileEachTurn: {
        label: "Must add to shared pile each turn",
        default: false, // TEMPORARY
    },
    canUseOpponentsWastePiles: {
        label: "Can use opponents waste piles",
        default: true, // TEMPORARY
    },
    jacksAndQueensSpecial: {
        label: "Jacks and queens special",
        default: true, // TEMPORARY
    }
};

export type SetupOptions = SpecifiedValues<typeof setupOptions>;

