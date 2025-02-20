import { Game, MoveFn } from "./bgio";

export type MoveArg0<State> = Parameters<MoveFn<State>>[0];
export type SetupArg0 = Parameters<Required<Game>["setup"]>[0];
