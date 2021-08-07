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
        sAssert(props.playerID);
        this.playerID = props.playerID;
        this.currentPlayer = props.ctx.currentPlayer;
        this.G = props.G;
        this.ctx = props.ctx;
        this.moves = props.moves as any as ClientMoves;
        this.events = props.events;
        this.clickDragState = clickDragState;
        this.allJoined = props.allJoined;
        this.playerData = props.playerData;
        this.config = props.config;
        this.boardProps = props;

    }

    private readonly ctx: Ctx;
    private readonly G: GameData;
    
    readonly playerID: string;
    readonly currentPlayer: string;
    readonly moves: ClientMoves;
    readonly events: ScrabbleBoardProps['events'];
    readonly clickDragState: ClickDragState;
    readonly allJoined: boolean;
    readonly playerData: PlayerDataDictionary;
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
}

export function useScrabbleData(props: ScrabbleBoardProps) : ScrabbleData{
    const clickDragState = useRef(new ClickDragState()).current;
    return new ScrabbleData(props, clickDragState);
}
