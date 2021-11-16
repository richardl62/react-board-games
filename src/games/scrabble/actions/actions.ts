import { Dispatch } from "react";
import { sAssert } from "shared/assert";
import { GeneralGameProps } from "shared/general-game-props";
import { shuffle } from "shared/tools";
import { blank, ScrabbleConfig } from "../config";
import { ClientMoves } from "./bgio-moves";
import { boardIDs } from "./game-actions";
import { BoardData, GameData } from "./game-data";
import { ActionType, GameState } from "./game-state-reducer";

export interface SquareID {
    row: number;
    col: number;
    boardID: string;
}

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

    readonly gameState: GameState;

    name(pid: string) : string {
        const playerData = this.generalProps.playerData[pid];
        sAssert(playerData);
        return playerData.name;
    }
    
    score(pid: string) : number {
        const playerData = this.generalProps.G.playerData[pid];
        sAssert(playerData);
        return playerData.score;
    }



    private get bgioMoves() : ClientMoves {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.generalProps.moves as any;
    }

    endTurn(score: number) : void {
        const rack = [...this.gameState.rack];
        const bag = [...this.gameState.bag];
        for (let ri = 0; ri < rack.length; ++ri) {
            if(!rack[ri]) {
                rack[ri] = bag.pop() || null;
            }
        }
    
        this.bgioMoves.setBoardRandAndScore({
            score: score,
            rack: rack,
            board: this.gameState.board,
            bag: bag,
        });    
        sAssert(this.generalProps.events.endTurn);
        this.generalProps.events.endTurn();
    }

    swapTiles(toSwap: boolean[]) : void {
        const bag = [...this.gameState.bag];

        for (let ri = 0; ri < toSwap.length; ++ri) {
            if (toSwap[ri]) {
                const old = this.gameState.rack[ri];
                sAssert(old, "Attempt to swap non-existant tile");
                bag.push(old);
                this.gameState.rack[ri] = bag.shift()!;
            }
        }
        shuffle(bag);
        
        this.bgioMoves.setBoardRandAndScore({
            score: 0,
            rack: this.gameState.rack,
            board: this.gameState.board,
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
