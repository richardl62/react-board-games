import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {  SquareID } from "../../boards";
import { sAssert } from "../../shared/assert";
import { ClientMoves } from "./bgio-moves";
import { BoardAndRack, Rack, TilePosition } from "./board-and-rack";
import { onRack } from "./game-actions";
import { BoardData } from "./game-data";
import { ScrabbleBoardProps } from "./scrabble-board-props";

export type { Rack };

type UseStateResult<S> =  [S, Dispatch<SetStateAction<S>>];

function tilePosition(sq: SquareID) : TilePosition {
    if(onRack(sq)) {
        return {rack: {pos: sq.col}};
    } else {
        return {board: sq};
    }
}

export class ScrabbleData {
    constructor(
        props: ScrabbleBoardProps, 
        boardState: UseStateResult<BoardData>,
        rackState: UseStateResult<Rack>,
        ) {

        sAssert(props.playerID);
        this.props = props;
        this.boardState = boardState;
        this.rackState = rackState;

        this.boardAndRack = new BoardAndRack(boardState[0], rackState[0])
    }

    private readonly props: ScrabbleBoardProps;
    private readonly boardState: UseStateResult<BoardData>;
    private readonly rackState: UseStateResult<Rack>;
    private boardAndRack: BoardAndRack;

    private get moves() : ClientMoves {
        return this.props.moves as any;
    }

    get board() { return this.boardAndRack.getBoard() };
    get rack() { return this.boardAndRack.getRack(); }
    get bag() { return this.props.G.bag; }
    get playOrder() { return this.props.ctx.playOrder }
    get playerID() { 
        sAssert(this.props.playerID); 
        return this.props.playerID;
    }
    get allJoined() { return this.props.allJoined; }
    get config() {return this.props.config;}


    get isMyTurn() : boolean {
        return this.props.playerID === this.props.ctx.currentPlayer;
    } 

    /** Limited use only 
     * Intened for use when using non-scrabble-specific utilities.
     */

    getProps() : ScrabbleBoardProps {
        return this.props;
    }

    name(pid: string) : string {
        const playerData = this.props.playerData[pid];
        sAssert(playerData);
        return playerData.name;
    }

    score(pid: string = this.playerID) : number {
        const playerData = this.props.G.playerData[pid];
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

        this.setState();
    }

    recallRack(){
        this.props.moves.recallRack();
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

        sAssert(this.props.events.endTurn);
        this.props.events.endTurn();
    }

    private setState() {
        this.boardState[1](this.board);
        this.rackState[1](this.rack);
    }
}

export function useScrabbleData(props: ScrabbleBoardProps) : ScrabbleData {
    sAssert(props.playerID);
    const playableTiles = props.G.playerData[props.playerID].playableTiles

    const boardState = useState<BoardData>([[]] /*KLUDGE: Any empty array, e.g. [], gives crashes*/);
    const rackState = useState<Rack>([]);

    useEffect(()=>{
        boardState[1](props.G.board);
        rackState[1](playableTiles)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.G.board, playableTiles]);

    return new ScrabbleData(props, boardState, rackState);
}
