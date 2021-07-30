import { BoardProps as BgioBoardProps, MatchDataElem } from "./bgio-types";
export const unnamedPlayer = '_Unnamed Player_';  // Why is this needed?

export interface PlayerData {
  name: string;
  id: string;
  status: 'ready' | 'not joined' | 'offline';
}

function defaultPlayerName(index: number) {
  return `Player ${index + 1}`;
}

function makePlayerDataElem(md: MatchDataElem, index: number): PlayerData {
  return (md.name) ?
    {
      name: (md.name === unnamedPlayer) ? defaultPlayerName(index) : md.name,
      id: md.id.toString(),
      status: md.isConnected ? 'ready' : 'offline',
    } :
    {
      name: defaultPlayerName(index),
      id: index.toString(),
      status: 'not joined',
    }
}

function sanityCheck(props: BgioBoardProps, playerData: PlayerData[]) {

  const checkPlayerID = (id: string | null) => {
    return playerData.find(pd => pd.id === id) !== undefined;
  }

  if (!checkPlayerID(props.playerID) || 
    !checkPlayerID(props.ctx.currentPlayer)) {
    console.log(playerData, props)
    throw new Error("Problem getting player data from match data");
  }
}

export function makePlayerData(props: BgioBoardProps): PlayerData[] {
 
  let playerData : PlayerData[];

  if(props.matchData) {
    playerData = props.matchData.map(makePlayerDataElem);
  } else {
    // This is a local game.  Make up playerData accordingly.
    playerData = [];
    for(let index = 0; index < props.ctx.numPlayers; ++index) {
      playerData[index] = {
        name: `Player ${index + 1}`,
        id: `${index}`,
        status: 'ready',
      }
    }
  }

  sanityCheck(props, playerData);

  return playerData;
}

