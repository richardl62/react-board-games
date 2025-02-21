import type { MoveFn } from "boardgame.io";

export type { MoveFn };
export type MoveArg0<State> = Parameters<MoveFn<State>>[0];