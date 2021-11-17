export { isGlobalGameState, startingGlobalGameState as startingGeneralGameState } from "./global-game-state";
export type { GlobalGameState as GeneralGameState } from "./global-game-state";

// bgioMoves is exported only for use in making the AppGames. 
export { bgioMoves } from "./bgio-moves";

export { getWordsAndScore } from "./get-words-and-score";
export { findActiveLetters } from "./find-active-letters";

export type { CoreTile } from "./core-tile";
export { tileScore } from "./core-tile";

export { boardIDs } from "./game-actions";
export type { SquareID } from "./game-actions";
