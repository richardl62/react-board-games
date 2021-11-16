import { sAssert } from "shared/assert";
import { boardIDs } from "./game-actions";
import { BoardData, GameData } from "./game-data";
import { blank, Letter } from "../config";
import { ScrabbleConfig } from "../config";
import { Dispatch } from "react";
import { BoardAndRack, Rack } from "./board-and-rack";
import { GeneralGameProps } from "shared/general-game-props";
import { CoreTile } from "./core-tile";
import { ClientMoves } from "./bgio-moves";
import { shuffle } from "shared/tools";

export interface SquareID {
    row: number;
    col: number;
    boardID: string;
}

export interface GameState {
    board: BoardData,
    rack: Rack,
    bag: CoreTile[],
    bgioTimestamp: number,
} 

export type ActionType =
    | { type: "noop" }
    | { type: "move", data: {from: SquareID,to: SquareID}}
    | { type: "recallRack" }
    | { type: "shuffleRack" }
    | { type: "setBlank", data: {id: SquareID, letter: Letter}}
    | { type: "bgioStateChange", data: GameState }
;

export class Actions {
    constructor(
        generalProps: GeneralGameProps<GameData>, 
        config: ScrabbleConfig,
        gameState: GameState,
        dispatch: Dispatch<ActionType>,
    ) {
        this.generalProps = generalProps;
        this.config = config;
        this.gameState = gameState,
        this.dispatch = dispatch;
    }

    // Clients should not access the game data, i.e. bgioProps.G
    readonly generalProps: GeneralGameProps<GameData>;

    readonly config: ScrabbleConfig;
    readonly dispatch:  Dispatch<ActionType>

    private readonly gameState: GameState;

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

    get board() : BoardData {
        return this.gameState.board;
    }

    get rack() : Rack {
        return this.gameState.rack;
    }

    private get bag() : CoreTile[] {
        return this.gameState.bag;
    }


    name(pid: string) : string {
        const playerData = this.generalProps.playerData[pid];
        sAssert(playerData);
        return playerData.name;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canMove(sq: SquareID) : boolean {
        //KLUDGE:  Very inefficient.
        const br = new BoardAndRack(this.gameState.board, this.gameState.rack);
        return br.canMove(sq);
    }
    
    score(pid: string) : number {
        const playerData = this.generalProps.G.playerData[pid];
        sAssert(playerData);
        return playerData.score;
    }

    get nTilesInBag() : number {
        return this.gameState.bag.length;
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

    private get bgioMoves() : ClientMoves {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.generalProps.moves as any;
    }

    endTurn(score: number) : void {
        const rack = [...this.rack];
        const bag = [...this.bag];
        for (let ri = 0; ri < rack.length; ++ri) {
            if(!rack[ri]) {
                rack[ri] = bag.pop() || null;
            }
        }
    
        this.bgioMoves.setBoardRandAndScore({
            score: score,
            rack: rack,
            board: this.board,
            bag: bag,
        });    
        sAssert(this.generalProps.events.endTurn);
        this.generalProps.events.endTurn();
    }

    swapTiles(toSwap: boolean[]) : void {
        const bag = [...this.bag];

        for (let ri = 0; ri < toSwap.length; ++ri) {
            if (toSwap[ri]) {
                const old = this.rack[ri];
                sAssert(old, "Attempt to swap non-existant tile");
                bag.push(old);
                this.rack[ri] = bag.shift()!;
            }
        }
        shuffle(bag);
        
        this.bgioMoves.setBoardRandAndScore({
            score: 0,
            rack: this.rack,
            board: this.board,
            bag: bag,
        });    
        sAssert(this.generalProps.events.endTurn);
        this.generalProps.events.endTurn();
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
