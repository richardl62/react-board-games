import { sAssert } from "../../../shared/assert";
import { shuffle } from "../../../shared/tools";
import { blank } from "../config";

import { Rack } from "./board-and-rack";
import { ExtendedLetter } from "./extended-letter";
import { RowCol } from "./get-words-and-score";
import { BoardData, GlobalGameState } from "./global-game-state";
import { LocalGameState } from "./local-game-state";
import { ScabbbleGameProps } from "../board/game-props";

export interface SquareID {
    row: number;
    col: number;
    boardID: string;
}

export const boardIDs = {
    rack: "rack",
    main: "main",
};

function sanityCheck(sq: SquareID ) {
    if(sq.boardID === boardIDs.main) {
        return true;
    }

    if(sq.boardID === boardIDs.rack) {
        return sq.row === 0;
    }

    return false;
}

export function onRack(sq: SquareID | null): boolean {
    if(!sq) {
        return false;
    } 
    sAssert(sanityCheck(sq));

    return sq.boardID === boardIDs.rack;
}

export function getWord(
    board: BoardData,

    /** must refer to non-empty board positions */
    positions: RowCol[]
) : string 

{
    const letters = positions.map(rc => {
        const sq = board[rc.row][rc.col];
        sAssert(sq);
        return sq.letter;
    });

    return "".concat(...letters);
}



export function addToRack(rack: Rack, tile: ExtendedLetter): void {
    const emptyIndex = rack.findIndex(t => t === null);
    sAssert(emptyIndex >= 0, "Attempt to add to full rack");

    // Black tiles lose any user defined value when returned to the rack.
    rack[emptyIndex] = tile.isBlank ? blank : tile.letter; 
}

/* move blank spaces to the end */
export function compactRack(rack: Rack): void {
    let setPos = 0;
    for(let readPos = 0; readPos < rack.length; ++readPos) {
        if(rack[readPos]) {
            rack[setPos] = rack[readPos];
            ++setPos;  
        }
    }
    for(; setPos < rack.length; ++setPos) {
        rack[setPos] = null;
    }
}

export function canSwapTiles(G: GlobalGameState): boolean {
    const rackSize = Object.values(G.playerData)[0].rack.length;
    return G.bag.length >= rackSize;
}

export function endTurn(localState: LocalGameState, bgioProps: ScabbbleGameProps, score: number) : void {
    const rack = [...localState.rack];
    const bag = [...localState.bag];
    for (let ri = 0; ri < rack.length; ++ri) {
        if(!rack[ri]) {
            const letter = bag.pop();
            rack[ri] = letter || null;
        }
    }

    bgioProps.moves.setBoardRandAndScore({
        score: score,
        rack: rack,
        board: localState.board,
        bag: bag,
        historyElement: {name: "someone", score: score}
    });    
    sAssert(bgioProps.events.endTurn);
    bgioProps.events.endTurn();
}

export function swapTiles(localState: LocalGameState, bgioProps: ScabbbleGameProps, toSwap: boolean[]) : void {
    const bag = [...localState.bag];

    for (let ri = 0; ri < toSwap.length; ++ri) {
        if (toSwap[ri]) {
            const old = localState.rack[ri];
            sAssert(old, "Attempt to swap non-existant tile");
            bag.push(old);
            localState.rack[ri] = bag.shift()!;
        }
    }
    shuffle(bag);
    
    bgioProps.moves.setBoardRandAndScore({
        score: 0,
        rack: localState.rack,
        board: localState.board,
        bag: bag,
        historyElement: {name: "someone", swapTiles: true},
    });    
    sAssert(bgioProps.events.endTurn);
    bgioProps.events.endTurn();
}
