import { sAssert } from "../../../utils/assert";
import { blank, Letter } from "../config";
import { makeLetter } from "../config/letters";
import { BoardAndRack } from "./board-and-rack";
import { SquareID } from "./game-actions";
import { applyPossibleWord } from "../high-scoring-words";
import { getHighScoringWords } from "../high-scoring-words";
import { newReducerState, ReducerState } from "./reducer-state";
import { ScrabbleGameProps } from "./srcabble-game-props";
import { Trie } from "../../../utils/word-finder/trie";
import { WordPosition, WordDirection } from "../../../utils/word-finder/get-legal-words/word-position";

export type ActionType =
    | { type: "move", data: {from: SquareID,to: SquareID}}
    | { type: "recallRack" }
    | { type: "shuffleRack" }
    | { type: "setBlank", data: {id: SquareID, letter: Letter}}
    | { type: "externalStateChange", data: ScrabbleGameProps }
    | { type: "setClickMoveStart", data: {row: number, col: number} }
    | { type: "moveToRack", data:  {row: number, col: number} }
    | { type: "clickMove", data: {rackPos: number}}
    | { type: "keydown", data: {key: string}}
    | { type: "setHistoryPosition", data: {position: number}}
    | { type: "enableHighScoringWords", data: {enable: boolean, legalWords: Trie}} // Kludge? Should the Trie be supplied here?
    | { type: "setHighScoringWordsPosition", data: {position: number}}
    | { type: "focusInWordChecker", data: {focusIn: boolean}}

export function scrabbleReducer(state : ReducerState, action: ActionType) : ReducerState {

    if(action.type === "externalStateChange") {
        // This code is an edited copy of initialReducerState 
        const scrabbleGameProps : ScrabbleGameProps = action.data;
        const newState = newReducerState(scrabbleGameProps, state);

        return newState;
    }

    if (action.type === "setHistoryPosition") {
        return newReducerState(state.scrabbleGameProps,
            { ...state, reviewGameHistory: { historyPosition: action.data.position } }
        );
    }

    if (action.type === "focusInWordChecker") {
        return { ...state, focusInWordChecker: action.data.focusIn};
    }

    const br = new BoardAndRack(state.board, state.rack);
    
    let clickMoveStart = state.clickMoveStart;
    let highScoringWords = state.highScoringWords;

    // For simplicity (?) most action disable high scoring words.
    // (The motive is to allow players to do things like moving letters without switching off
    // the option. Previously this sort of move would not work because the high scoring word
    // was reapplied.)
    let preserveHighScoringWords = false;
    
    if(action.type === "setClickMoveStart") {
        const {row, col} = action.data;
        clickMoveStart = newClickMoveState(row, col, clickMoveStart);
    } else if(action.type === "move") {
        clickMoveStart = null;
        br.move(action.data);
    } else if(action.type === "clickMove") {
        if( state.clickMoveStart ) {
            br.moveFromRack({start: state.clickMoveStart, rackPos: action.data.rackPos});
        } else {
            console.warn("Attempted clickMove when start is not set");
        }
    } else if(action.type === "moveToRack") {
        br.moveToRack(action.data);
    } 
    else if(action.type === "keydown") {
        if( !state.focusInWordChecker) {
            const letter = makeLetter(action.data.key);
            if( letter ) {
                moveFromRack(br, letter, state.clickMoveStart);
            }
        }
    } else if(action.type === "recallRack") {
        br.recallRack();
    } else if(action.type === "shuffleRack") {
        br.shuffleRack();
    } else if(action.type === "setBlank") {
        br.setBlank(action.data.id, action.data.letter);
    } else if(action.type === "enableHighScoringWords") {
        br.recallRack();
        if(action.data.enable) {
            highScoringWords = {
                possibleWords: getHighScoringWords(br, action.data.legalWords, state.config),
                position: 0,
            };
            preserveHighScoringWords = true;
        } else {
            highScoringWords = null;
        }
    }
    else if(action.type === "setHighScoringWordsPosition") {
        sAssert(highScoringWords && highScoringWords.possibleWords[action.data.position]);
        highScoringWords.position = action.data.position;
        preserveHighScoringWords = true;
    } else {
        console.warn("Unrecognised action in reducer:", action);
    }

    if (!preserveHighScoringWords) {
        highScoringWords = null;
    }
    
    if(highScoringWords) {
        const {possibleWords, position} = highScoringWords;
        if(possibleWords.length !== 0) {
            sAssert(possibleWords[position]);
            applyPossibleWord(br, possibleWords[position]);
        }
    }

    const newState : ReducerState = {
        ...state,
        board: br.getBoard(),
        rack: br.getRack(),
        clickMoveStart: clickMoveStart,
        highScoringWords: highScoringWords,
    };

    return newState;
}

function moveFromRack(br: BoardAndRack, letter: Letter, clickMoveStart: WordPosition | null) {
    if( !clickMoveStart ) {
        return;
    }

    const letterPos = br.findInRack(letter);
    if (letterPos !== null) {
        br.moveFromRack({start: clickMoveStart, rackPos: letterPos});
    } else {
        const blackPos = br.findInRack(blank);
        if (blackPos !== null) {
            const newBlankPos = br.moveFromRack({ start: clickMoveStart, rackPos: blackPos });
            if (newBlankPos !== null) {
                br.setBlank(newBlankPos, letter);
            }
        }
    }
}

function newClickMoveState(row: number, col: number, oldCMS: WordPosition | null): WordPosition | null {
    let direction : WordDirection | null;

    // If the same square is clicked multiple times, the arrow cycles
    // in the order right, down, none.
    if (oldCMS && oldCMS.row === row && oldCMS.col === col ) {
        direction = (oldCMS.direction === "row") ? "column" : null;
    } else {
        // A new square has been picked so choice the default direction.
        direction = "row";
    }

    return direction && {row: row, col: col, direction: direction };
}


