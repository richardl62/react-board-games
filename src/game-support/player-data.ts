import { MatchDataElem } from '../shared/board-props';
import { BoardProps } from '../shared/types';
export const unnamedPlayer = '_Unnamed Player_';  // Why is this needed?

export interface PlayerData {
  name: string;
  status: 'ready' | 'not joined' | 'offline';
}

function getMatchData(props: BoardProps) : MatchDataElem[] {
  if(props.matchData) {
    return props.matchData;
  }

  // This appears to be an online game.  Return constucted data.
  const numPlayers = props.ctx.numPlayers;

  const result = [];
  for (let id = 0; id < numPlayers; ++id) {
    result.push({
      name: `Player ${id + 1}`,
      id: 0,
      isConnected: true,
    })
  }

  return result;  
}

export function getPlayerData(props: BoardProps) : PlayerData[] {
  const { ctx } = props;
  const playerID = Number(props.playerID);
  const currentPlayer = Number(ctx.currentPlayer)
 
  const matchData = getMatchData(props);
  if (!matchData[playerID] || !matchData[currentPlayer]) {
    console.log(matchData, playerID, currentPlayer)
    throw new Error("Problem getting player data from match data");
  }

  return matchData.map((md, index) => {
    const defaultPlayerName = `Player ${index + 1}`;
    if(md.name) {
      return {
        name: (md.name === unnamedPlayer) ? defaultPlayerName : md.name,
        status: md.isConnected ? 'ready' : 'offline',
      }
    } else {
      return {
        name: defaultPlayerName,
        status: 'not joined',
      }
    }
  })
}

/**
 * joined -> all players joined. (Some may be offline.)
 * online -> all players joined and online.
 */
export function playerStatus(props: BoardProps): { 
  joined: boolean; 
  online: boolean; 
}  {
  const playerData = getPlayerData(props);

  let allJoined = true;
  let allOnline = true;
  for(let pd of playerData) {
    if(pd.status !== "ready") {
      allOnline = false;
    }
    if(pd.status === "not joined") {
      allJoined = false;
    }
  }
  return {joined: allJoined, online: allOnline};
}
