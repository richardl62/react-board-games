import { SpecifiedValues } from "../../../app/option-specification/types";

export const setupOptions = {
    mainPileSize: {
        label: "Size of players' piles",
        default: 24,
        min: 1,
    },
    nSharedPilesAtStart: {
        label: "No of shared piles at start",
        default: 10,
        min: 0,
    },
    addToSharedPileEachTurn: {
        label: "Must add to shared pile each turn",
        default: false,
    },
    canUseOpponentsWastePiles: {
        label: "Can use opponents waste piles",
        default: false,
    },
    jacksAndQueensSpecial: {
        label: "Jacks and queens special",
        default: true,
    }
};

export type SetupOptions = SpecifiedValues<typeof setupOptions>;

