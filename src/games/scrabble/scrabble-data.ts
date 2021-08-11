import { Ctx } from "boardgame.io";
import { useState } from "react";
import {  SquareID } from "../../boards";
import { sAssert } from "../../shared/assert";
import { BoardProps } from "../../shared/types";
import { ClientMoves } from "./bgio-moves";
import { BoardAndRack, TilePosition } from "./board-and-rack";
import { onRack } from "./game-actions";
import { BoardData, GameData } from "./game-data";
import { ScrabbleBoardProps } from "./scrabble-board-props";
import { Letter, ScrabbleConfig } from "./scrabble-config";

export type Rack = (Letter | null)[];


function tilePosition(sq: SquareID) : TilePosition {
    if(onRack(sq)) {
        return {rack: {pos: sq.col}};
    } else {
        return {board: sq};
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

    get board() { return this.boardAndRack.getBoard() };
    get rack() { return this.boardAndRack.getRack(); }
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
        return this.boardAndRack.isPlayable(tilePosition(sq));
    }

    move(arg: {from: SquareID,to: SquareID}){
        const from = tilePosition(arg.from);
        const to = tilePosition(arg.to);

        const br = this.boardAndRack;

        const letter = br.getLetter(from);
        br.setActiveLetter(from, null);
        if(to.board) {
            br.setActiveLetter(to, letter);
        } else {
            br.insertIntoRack(to, letter);
        }
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
        this.moves.endOfTurnActions({
            score: score,
            rack: this.boardAndRack.getRack(),
            board: this.boardAndRack.getBoard(),
        });

        sAssert(this.boardProps.events.endTurn);
        this.boardProps.events.endTurn();
    }
}

export function useScrabbleData(props: ScrabbleBoardProps) : ScrabbleData {
    sAssert(props.playerID);
    const boardState = useState<BoardData>(props.G.board);
    const rackState = useState(props.G.playerData[props.playerID].playableTiles);

    const boardAndRack = new BoardAndRack(boardState[0], rackState[0]);

    return new ScrabbleData(props, boardAndRack);
}
