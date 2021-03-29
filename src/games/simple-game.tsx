interface G {
  value: number;
};

const game = {
  // The name of the game.
  name: 'simple',

  // Function that returns the initial value of G.
  // setupData is an optional custom object that is
  // passed through the Game Creation API.
  setup: (): G => { return { value: 0 }; },

  turn: {
    moveLimit: 1,
  },

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