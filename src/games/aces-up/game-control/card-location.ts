
export type CardLocation = {
    area: "sharedPiles",
    index: number,
} | {
    area: "playerPile",
} | {
    area: "kings",
} | {
    area: "hand",
    index: number,
} | {
    area: "discardPiles",
    pileIndex: number,
    cardIndex: number,
}

