export { isGlobalGameState, startingGlobalGameState as startingGeneralGameState } from "../global-actions/global-game-state";
export type { GlobalGameState as GeneralGameState } from "../global-actions/global-game-state";

// bgioMoves is exported only for use in making an AppGame. 
export { bgioMoves } from "../global-actions/bgio-moves";

export { getWordsAndScore } from "./get-words-and-score";
export { findActiveLetters } from "./find-active-letters";

export type { ExtendedLetter as CoreTile } from "./extended-letter";
export { tileScore } from "./extended-letter";

export { boardIDs } from "./game-actions";
export type { SquareID } from "./game-actions";
