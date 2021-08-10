import { Ctx } from "boardgame.io";
import { useState } from "react";
import {  SquareID } from "../../boards";
import { sAssert } from "../../shared/assert";
import { BoardProps } from "../../shared/types";
import { ClientMoves } from "./bgio-moves";
import { onRack } from "./game-actions";
import { BoardData, GameData } from "./game-data";
import { ScrabbleBoardProps } from "./scrabble-board-props";
import { Letter, ScrabbleConfig } from "./scrabble-config";

export type Rack = (Letter | null)[];

type PlayableTilePosition = 
    {
        rack: number; 
    } |
    {
        board: {row: number; col: number;}
    };

function defaultPlayableTilePositions(rackSize: number) : PlayableTilePosition[] {
    let positions = [];
    for(let pos = 0; pos < rackSize; ++pos) {
        positions.push({rack: pos});
    }
    return positions;
}

class BoardAndRack {
    constructor(board: BoardData, playableTiles: Rack, playableTilePositions: PlayableTilePosition[]) {
        this.board = board.map(row => [...row]);
        this.rack = [...playableTiles];
    }

    readonly board: BoardData;
    readonly rack: Rack;
}

export class ScrabbleData extends BoardAndRack {
    constructor(props: ScrabbleBoardProps,
        playableTilePositions: PlayableTilePosition[],
        setPlayableTilePositions: (arg: PlayableTilePosition[]) => void) {

        sAssert(props.playerID);
        const playableTiles = props.G.playerData[props.playerID].playableTiles;

        super(props.G.board, playableTiles, playableTilePositions);
        this.boardProps = props;
        this.playableTilePositions = playableTilePositions;
        this.setPlayableTilePositions = setPlayableTilePositions;

        this.playerID = props.playerID;
        this.currentPlayer = props.ctx.currentPlayer;
        this.G = props.G;
        this.ctx = props.ctx;
        this.moves = props.moves as any as ClientMoves;
        this.allJoined = props.allJoined;
        this.config = props.config;
    }

    private readonly playableTilePositions: PlayableTilePosition[];
    private readonly setPlayableTilePositions: (arg: PlayableTilePosition[]) => void;
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

    get bag() {return this.G.bag;}
    get playOrder() {return this.ctx.playOrder}

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
        return this.isMyTurn && (onRack(sq) || Boolean(this.board[sq.row][sq.col]?.active));
    }

    move(arg: {from: SquareID,to: SquareID}){
        // this.moves.move(arg);
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
    const [playableTilePositions, setPlayableTilePositions] = 
        useState(defaultPlayableTilePositions(props.config.rackSize));

    return new ScrabbleData(props, playableTilePositions, setPlayableTilePositions);
}
