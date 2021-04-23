import styles from './boards.module.css';
import { nonNull } from "../shared/tools";
import { BoardProps } from '../shared/types';
export const unnamedPlayer = '_Unnamed Player_';

interface BoardAndPlayerProps extends BoardProps {
  children: React.ReactNode;
}
export function BoardAndPlayers(props: BoardAndPlayerProps) {
  const {ctx, matchData, children } = props;

  if(!matchData) {
    return <div>No player information found</div>;
  }

  const playerID = Number(props.playerID);
  const currentPlayer = Number(ctx.currentPlayer)
  if (!matchData[playerID] || !matchData[currentPlayer]) {
    throw new Error("Bad player index");
  }

  const playerElems = [];
  for (let index = 0; index < matchData.length; ++index) {
    const p = matchData[index];
    if (p.name) {
      let text: string;
      if (p.name === unnamedPlayer) {
        text = (index === playerID) ? 'You' : `Player ${p.id}`;
      } else {
        text = p.name;
      }
      
      if (!p.isConnected) {
        text += ' (Offline)';
      }

      const className = index === currentPlayer ? nonNull(styles.currentPlayer) : undefined;

      playerElems.push(<div key={p.id} className={className}> {text} </div>);
    }
  }

  const numToJoin = matchData.length - playerElems.length;
  return (
    <div>
      <div className={nonNull(styles.playerNames)}>
        <span>Players:</span>
        {playerElems}
      </div>
      {numToJoin === 0 ?
        <div>{children}</div> :
        <div>{`Waiting for ${numToJoin} more player(s) to join`}</div>
      }
    </div>);
}
