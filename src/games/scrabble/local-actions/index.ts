export { getWordsAndScore } from "./get-words-and-score";
export { findActiveLetters } from "./find-active-letters";

export type { ExtendedLetter as CoreTile } from "./extended-letter";
export { tileScore } from "./extended-letter";

export { boardIDs } from "./game-actions";
export type { SquareID } from "./game-actions";

/*
import { getLocalGameState } from "./local-game-state";
import { localGameStateReducer } from "./local-game-state-reducer";
import { ClickMoveDirection } from "./local-game-state";
import { swapTiles } from "./game-actions";
import { makeExtendedLetter } from "./extended-letter";
import { LocalGameState } from "./local-game-state";
import { ActionType } from "./local-game-state-reducer";
import { playWord, passMove } from "./game-actions";
import { ExtendedLetter } from "./extended-letter";
*/