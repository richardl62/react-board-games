import { Ctx } from "boardgame.io";
import { Dispatch, SetStateAction, useState } from "react";
import {  SquareID } from "../../boards";
import { sAssert } from "../../shared/assert";
import { BoardProps } from "../../shared/types";
import { ClientMoves } from "./bgio-moves";
import { onRack } from "./game-actions";
import { BoardData, GameData } from "./game-data";
import { ScrabbleBoardProps } from "./scrabble-board-props";
import { Letter, ScrabbleConfig } from "./scrabble-config";

export type Rack = (Letter | null)[];
type UseStateResult<T> = [T, Dispatch<SetStateAction<T>>];

// type PlayableTilePosition = 
//     {
//         rack: number; 
//         board?: undefined;
//     } |
//     {
//         rack?: undefined;
//         board: {row: number; col: number;}

//     };



class BoardAndRack {
    constructor(
        boardState: UseStateResult<BoardData>,
        rackState: UseStateResult<Rack>,
        ) {
            this.boardState = boardState;
            this.rackState = rackState;

            // Working copies of board and rack.
            this.board = boardState[0].map(row => [...row]);
            this.rack = [...rackState[0]];
        }

    private readonly board: BoardData;
    private readonly boardState: UseStateResult<BoardData>;
    private readonly rack: Rack;
    private readonly rackState: UseStateResult<Rack>;


    getLetter(sq: SquareID) : Letter | null {
        if(onRack(sq)) {
            return this.rack[sq.col];
        } else {
            const bsq = this.board[sq.row][sq.col];
            return bsq && bsq.letter;
        }
    }

    setActiveLetter(sq: SquareID, letter: Letter | null){
        if(onRack(sq)) {
           this.rack[sq.col] = letter;
        } else {
            this.board[sq.row][sq.col] = letter && {
                letter: letter,
                active: true,
            }
        }
    }

    isPlayable(sq: SquareID) : boolean {
        if(onRack(sq)) {
            return true;
        }

        return true; // For now.
    }

    updateState() {
        this.boardState[1](this.board);
        this.rackState[1](this.rack);
    }

    getBoardFromState() : BoardData {
        return this.boardState[0];
    }

    getRackFromState() : Rack {
        return this.rackState[0];
    }
}

export class ScrabbleData {
    constructor(props: ScrabbleBoardProps, boardAndRack: BoardAndRack) {

        sAssert(props.playerID);
        this.boardProps = props;
        this.boardAndRack = boardAndRack;
  
        this.playerID = props.playerID;
        this.currentPlayer = props.ctx.currentPlayer;
        this.G = props.G;
        this.ctx = props.ctx;
        this.moves = props.moves as any as ClientMoves;
        this.allJoined = props.allJoined;
        this.config = props.config;
    }

    private readonly boardAndRack: BoardAndRack;
    private readonly ctx: Ctx;
    private readonly G: GameData;
    private readonly moves: ClientMoves;
    
    readonly playerID: string;
    readonly currentPlayer: string;
    readonly allJoined: boolean;


    readonly config: ScrabbleConfig;

    /** Intended for use only when 'leaving the world of Scrabble',
     *  e.g. when using game-agnostic tools.
     */
    readonly boardProps: BoardProps;

    get board() { return this.boardAndRack.getBoardFromState() };
    get rack() { return this.boardAndRack.getRackFromState(); }
    get bag() { return this.G.bag; }
    get playOrder() { return this.ctx.playOrder }

    get isMyTurn() : boolean {
        return this.playerID === this.ctx.currentPlayer;
    } 

    name(pid: string = this.playerID) : string {
        const playerData = this.boardProps.playerData[pid];
        sAssert(playerData);
        return playerData.name;
    }

    score(pid: string = this.playerID) : number {
        const playerData = this.G.playerData[pid];
        sAssert(playerData);
        return playerData.score;
    }

    canMove(sq: SquareID) : boolean {
        return this.boardAndRack.isPlayable(sq);
    }

    move({from, to}: {from: SquareID,to: SquareID}){
        const br = this.boardAndRack;
        const letter = br.getLetter(from);
        br.setActiveLetter(to, letter);
        br.setActiveLetter(from, null);

        br.updateState();
    }

    recallRack(){
        this.moves.recallRack();
    }

    shuffleRack(){
        this.moves.shuffleRack();
    }

    swapTiles(toSwap: boolean[]) {
        this.moves.swapTilesInRack(toSwap);
    }

    endTurn(score: number) {
        this.moves.endOfTurnActions(score);

        sAssert(this.boardProps.events.endTurn);
        this.boardProps.events.endTurn();
    }
}

export function useScrabbleData(props: ScrabbleBoardProps) : ScrabbleData{
    sAssert(props.playerID);
    const boardState = useState<BoardData>(props.G.board);
    const rackState = useState(props.G.playerData[props.playerID].playableTiles);
    const boardAndRack = new BoardAndRack(boardState, rackState);

    return new ScrabbleData(props, boardAndRack);
}
