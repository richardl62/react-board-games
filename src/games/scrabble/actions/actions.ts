import { sAssert } from "shared/assert";
import { boardIDs } from "./game-actions";
import { BoardData, GameData } from "./game-data";
import { blank, Letter } from "../config";
import { ScrabbleConfig } from "../config";
import { Dispatch } from "react";
import { Rack } from "./board-and-rack";
import { GeneralGameProps } from "shared/general-game-props";

export interface SquareID {
    row: number;
    col: number;
    boardID: string;
}

export type ActionType =
    | { type: "move", data: {from: SquareID,to: SquareID}}
    | { type: "recallRack" }
    | { type: "shuffleRack" }
    | { type: "setBlank", data: {id: SquareID, letter: Letter}}
    | { type: "swapTiles", data: boolean[] }
    | { type: "bgioStateChange", data: GeneralGameProps<GameData> }
;

export class Actions {
    constructor(
        generalProps: GeneralGameProps, 
        config: ScrabbleConfig,
        board: BoardData,
        rack: Rack,
        nTilesInBag: number,
        dispatch: Dispatch<ActionType>,
    ) {
        this.generalProps = generalProps;
        this.config = config;
        this.board = board;
        this.rack = rack;
        this.nTilesInBag = nTilesInBag,
        this.dispatch = dispatch;
    }

    // Clients should not access the game data, i.e. bgioProps.G
    readonly generalProps: GeneralGameProps;

    readonly config: ScrabbleConfig;
    readonly dispatch:  Dispatch<ActionType>

    readonly board: BoardData;
    readonly rack: Rack;
    readonly nTilesInBag: number;

    get playOrder(): string[] {
        return this.generalProps.ctx.playOrder;
    }

    get playerID(): string {
        sAssert(this.generalProps.playerID);
        return this.generalProps.playerID;
    }

    get currentPlayer(): string {
        return this.generalProps.ctx.currentPlayer;
    }

    get allJoined(): boolean {
        return this.generalProps.allJoined;
    }

    get isMyTurn() : boolean {
        return this.generalProps.playerID === this.currentPlayer;
    } 

    name(pid: string) : string {
        const playerData = this.generalProps.playerData[pid];
        sAssert(playerData);
        return playerData.name;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canMove(sq: SquareID) : boolean {
        console.warn("Actions.canMove is not implemented");
        return true;
        //return this.boardAndRack.isActive(tilePosition(sq));
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    score(pid: string) : number {
        console.warn("Actions.score is not implemented");
        return -1;
    //     const playerData = this.bgioProps.G.playerData[pid];
    //     sAssert(playerData);
    //     return playerData.score;
    }

    /**
     * @param toSwap - Array of the same size as the rack.
     * Tiles are swapped if the correspoing element of toSwap is true.
     * (The true elements of toSwap must correspond to non-null elememts 
     * of the rack).
     */
    get allowSwapping() : boolean {
        return this.nTilesInBag >= this.config.rackSize;
    } 
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    endTurn(score: number): void {
        throw new Error("not yet implemented");
    }
}


/** 
* Report whether there are active tiles on the board.
* 
* Active tiles are those taken from the rack. 
*
* Note: For most of the game this is equivalent to checking if the rank has 
* gaps. But difference can occur at the end of the game when the bag is emtpy.
*/
export function tilesOut(board: BoardData): boolean {
    return !!board.find(row => row.find(sq => sq?.active));
}

export function findUnsetBlack(board: BoardData): SquareID | null {
    for (let row = 0; row < board.length; ++row) {
        for (let col = 0; col < board[row].length; ++col) {
            if(board[row][col]?.letter === blank) {
                return {
                    row: row,
                    col: col,
                    boardID: boardIDs.main,
                };
            }
        }
    }

    return null;
}
