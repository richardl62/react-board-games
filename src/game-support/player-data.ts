import { Bgio } from '../shared/types';
export const unnamedPlayer = '_Unnamed Player_';  // Why is this needed?

export interface PlayerData {
  name: string;
  status: 'ready' | 'not joined' | 'offline';
}

export function getPlayerData(props: Bgio.BoardProps) : PlayerData[] {
  const { ctx, matchData } = props;
  const playerID = Number(props.playerID);
  const currentPlayer = Number(ctx.currentPlayer)
 
  if(!matchData) {
    // Assume this is a single-player off-line game.
    // To do: Make this an properly supported option.
    return [
      {
      name: 'Player (offline)',
      status: 'ready',
      }
    ];
  }

  if (!matchData[playerID] || !matchData[currentPlayer]) {
    console.log(matchData, playerID, currentPlayer)
    throw new Error("Problem getting player data from match data");
  }

  return matchData.map((md, index) => {
    const defaultPlayerName = `Player ${index + 1}`;
    if(md.name) {
      return {
        name: (md.name === unnamedPlayer) ? md.name: defaultPlayerName,
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

export function playersReady(playerData: PlayerData[]) : boolean {
  const unready = playerData.find(p => p.status !== 'ready');
  return unready === undefined;
}
