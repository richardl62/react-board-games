import { PlayerID } from "../../../boardgame-lib/playerid";
import { ServerData } from "./server-data";
import { DiscardPile } from "./discard-pile";

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