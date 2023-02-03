
export type CardLocation = {
    area: "sharedPiles",
    index: number,
} | {
    area: "playerPile",
    index?: undefined,
} | {
    area: "kings",
    index?: undefined,
} | {
    area: "hand",
    index: number,
} | {
    area: "discardPiles",
    index: number,
}

