import { Game, MoveFn } from "../boardgame-lib/bgio";

export type MoveArg0<State> = Parameters<MoveFn<State>>[0];
export type SetupArg0 = Parameters<Required<Game>["setup"]>[0];
