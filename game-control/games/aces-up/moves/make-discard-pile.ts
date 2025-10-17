import { PlayerID } from "../../../playerid.js";
import { ServerData } from "../server-data.js";
import { DiscardPile } from "../misc/discard-pile.js";

export function makeDiscardPiles(
    G: ServerData,
    playerID: PlayerID
) : DiscardPile [] {
    const discardPileData = G.playerData[playerID].discardPileData;
    return discardPileData.map(
        (data) => new DiscardPile(data, G.options)
    );  
}

export function makeDiscardPile(
    G: ServerData,
    playerID: PlayerID,
    pileIndex: number,
) : DiscardPile {
    const discardPileData = G.playerData[playerID].discardPileData;
    return new DiscardPile(discardPileData[pileIndex], G.options);
}