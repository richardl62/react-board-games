import styles from './boards.module.css';
import { nonNull } from "../shared/tools";
export const unnamedPlayer = '_Unnamed Player_';

export function BoardAndPlayers(props: any /*kludge*/) {
  const game = props.game;
  const ctx = props.ctx;
  const matchData: Array<any> = props.matchData;

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
        game.board(props) :
        <div>{`Waiting for ${numToJoin} more player(s) to join`}</div>
      }
    </div>);
}
