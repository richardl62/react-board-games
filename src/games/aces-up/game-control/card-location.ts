import { PlayerID } from "boardgame.io"

export type CardLocation = {
    area: "sharedPiles",
    index: number,
} | {
    area: "playerPile",
    owner: PlayerID,
} | {
    area: "kings",
    owner: PlayerID,
} | {
    area: "hand",
    owner: PlayerID,
    index: number,
} | {
    area: "discardPiles",
    owner: PlayerID,
    pileIndex: number,
    cardIndex: number,
}

