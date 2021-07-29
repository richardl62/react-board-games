import { BoardProps as BgioBoardProps, MatchDataElem} from "./bgio-types";
export const unnamedPlayer = '_Unnamed Player_';  // Why is this needed?

export interface PlayerData {
  name: string;
  status: 'ready' | 'not joined' | 'offline';
}

function getMatchData(props: BgioBoardProps) : MatchDataElem[] {
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

export function makePlayerData(props: BgioBoardProps) : PlayerData[] {
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

