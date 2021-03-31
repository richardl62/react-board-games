import { AppFriendlyGame } from '../types';

interface G {
  value: number;
};

const game : AppFriendlyGame = {
  // The name of the game.
  name: 'plusminus',
  displayName: 'plus minus (for testing)',

  setup: (): G => { return { value: 0 }; },

  // turn: {
  //   moveLimit: 1,
  // },

  moves: {
    // short-form move.
    add: (G: G, ctx: any, value: number) => {
      G.value += value;
    },
  },

  renderGame: ({ G, moves }: { G: G, moves: any }) => {
    return (
      <div>
        <button type="button" onClick={(() => moves.add(1))}>+1</button>
        <button type="button" onClick={(() => moves.add(-1))}>-1</button>
        <div>{G.value}</div>
      </div>
    )
  }
}

export default game;