import { Ctx } from "boardgame.io";
import {  SquareID } from "../../boards";
import { sAssert } from "../../shared/assert";
import { BoardProps } from "../../shared/types";
import { ClientMoves } from "./bgio-moves";
import { onRack } from "./game-actions";
import { GameData, Rack } from "./game-data";
import { ScrabbleBoardProps } from "./scrabble-board-props";
import { ScrabbleConfig } from "./scrabble-config";

export class ScrabbleData {
    constructor(props: ScrabbleBoardProps) {
        this.boardProps = props;

        sAssert(props.playerID);
        this.playerID = props.playerID;
        this.currentPlayer = props.ctx.currentPlayer;
        this.G = props.G;
        this.ctx = props.ctx;
        this.moves = props.moves as any as ClientMoves;
        this.allJoined = props.allJoined;
        this.config = props.config;
    }

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

    get board() {return this.G.board;}
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

    rack(pid: string = this.playerID) : Rack {
        const playerData = this.G.playerData[pid];
        sAssert(playerData);
        return playerData.rack;
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
        this.moves.move(arg);
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
    return new ScrabbleData(props);
}
