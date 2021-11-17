export { Actions, useActions } from "./actions";

export { startingGameData } from "./game-data";

// bgioMoves is exported only for use in making the AppGames. 
export { bgioMoves } from "./bgio-moves";

//KLUDGE?:  Should this be part of Actions?
export { getWordsAndScore } from "./get-words-and-score";

//KLUDGE?:  Should this be part of Actions?
export { findActiveLetters } from "./find-active-letters";

// KLUDGE? Should these exports be necessary?
export type { CoreTile } from "./core-tile";
export { tileScore } from "./core-tile";

// KLUDGE? Should these exports be necessary?
export { boardIDs } from "./game-actions";
