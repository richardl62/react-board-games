import games  from '../games'
type Game = (typeof games)[number]; // KLUDGE

export type {Game}