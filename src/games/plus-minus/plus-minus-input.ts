import { BasicGame } from "../../shared/types";

export interface G {
  value: number;
};

const plusminus : BasicGame = {
  // The name of the game.
  name: 'plusminus',
  displayName: 'Plus Minus (for testing)',

  setup: (): G => { return { value: 0 }; },

  minPlayers: 1,
  maxPlayers: 100,

  // turn: {
  //   moveLimit: 1,
  // },

  moves: {
    // short-form move.
    add: (G: G, ctx: any, value: number) => {
      G.value += value;
    },
  },
}

export const plusminusInput = [ plusminus ];