import { sAssert } from "./assert";
import { BoardProps as BgioBoardProps } from "./bgio-types";
export const unnamedPlayer = '_Unnamed Player_';  // Why is this needed?

export interface PlayerData {
  name: string;
  status: 'ready' | 'not joined' | 'offline';
}

export type PlayerDataDictionary = {[arg: string] : PlayerData};

function defaultPlayerName(index: number) {
  return `Player ${index + 1}`;
}

function makePlayerDataElem(props: BgioBoardProps, playerID: string): PlayerData {
  const playerIndex = parseInt(playerID);
  sAssert(!isNaN(playerIndex) && playerIndex >= 0 && playerIndex < props.ctx.numPlayers,
    `Unexpected player ID: "${playerID}"`
  );

  if (!props.matchData) {
    // This seems to be an offline game
    return {
      name: defaultPlayerName(playerIndex),
      status: 'ready',
    }
  }

  const md = props.matchData.find(md => md.id === playerIndex);
  sAssert(md, `Cannot find player data for ID ${playerID}`);
  
  if (!md.name) {
    return {
      name: defaultPlayerName(playerIndex),
      status: 'not joined',
    }
  }

  return {
    name: (md.name === unnamedPlayer) ? defaultPlayerName(playerIndex) : md.name,
    status: md.isConnected ? 'ready' : 'offline'
  }

}

export function makePlayerData(props: BgioBoardProps): PlayerDataDictionary {
 
  const playerData : PlayerDataDictionary = {};
  for(const id in props.ctx.playOrder) {
    playerData[id] = makePlayerDataElem(props, id);
  }

  return playerData;
}

