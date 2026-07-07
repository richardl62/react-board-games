import { MoveArg0 } from '../../../move-fn.js';
import { PlayerID } from '../../../playerid.js';
import { PlayerData, ServerData } from '../server-data.js';
import { DiscardPile } from '../misc/discard-pile.js';

type Arg0 = Pick<MoveArg0<ServerData, PlayerData>, 'G' | 'getPlayerData'>;

export function makeDiscardPiles(arg0: Arg0, playerID: PlayerID): DiscardPile[] {
  const discardPileData = arg0.getPlayerData(playerID).discardPileData;
  return discardPileData.map((data) => new DiscardPile(data, arg0.G.options));
}

export function makeDiscardPile(arg0: Arg0, playerID: PlayerID, pileIndex: number): DiscardPile {
  const discardPileData = arg0.getPlayerData(playerID).discardPileData;
  return new DiscardPile(discardPileData[pileIndex], arg0.G.options);
}
