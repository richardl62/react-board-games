import { Ctx } from "boardgame.io";
import { useRef } from "react";
import { ClickDragState, SquareID } from "../../boards";
import { sAssert } from "../../shared/assert";
import { PlayerDataDictionary } from "../../shared/player-data";
import { ClientMoves } from "./bgio-moves";
import { onRack } from "./game-actions";
import { GameData } from "./game-data";
import { ScrabbleBoardProps } from "./scrabble-board-props";
import { ScrabbleConfig } from "./scrabble-config";

export class ScrabbleData {
    constructor(props: ScrabbleBoardProps, clickDragState: ClickDragState) {
        this.boardProps = props;
        this.clickDragState = clickDragState;

        sAssert(props.playerID);
        this.playerID = props.playerID;
        this.currentPlayer = props.ctx.currentPlayer;
        this.G = props.G;
        this.ctx = props.ctx;
        this.moves = props.moves as any as ClientMoves;
        this.allJoined = props.allJoined;
        this.playerData = props.playerData;
        this.config = props.config;
    }

    private readonly ctx: Ctx;
    private readonly G: GameData;
    private readonly moves: ClientMoves;
    
    readonly playerID: string;
    readonly currentPlayer: string;
    readonly allJoined: boolean;
    readonly playerData: PlayerDataDictionary;

    readonly clickDragState: ClickDragState;

    readonly config: ScrabbleConfig;

    readonly boardProps: ScrabbleBoardProps;

    get board() {return this.G.board;}
    get rackEtc() {return this.G.playerData;}
    get bag() {return this.G.bag;}
    get playOrder() {return this.ctx.playOrder}

    get isMyTurn() : boolean {
        return this.playerID === this.ctx.currentPlayer;
    } 

    canMove(sq: SquareID) : boolean {
        return this.isMyTurn && (onRack(sq) || Boolean(this.board[sq.row][sq.col]?.active));
    }

    startMove(sq: SquareID){
        this.moves.start(sq);
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
        this.moves.endOfTurnActions();
        this.moves.recordScore(score);


        sAssert(this.boardProps.events.endTurn);
        this.boardProps.events.endTurn();
    }
}

export function useScrabbleData(props: ScrabbleBoardProps) : ScrabbleData{
    const clickDragState = useRef(new ClickDragState()).current;
    return new ScrabbleData(props, clickDragState);
}
