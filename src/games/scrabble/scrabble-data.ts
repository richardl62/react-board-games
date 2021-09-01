import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {  squareID, SquareID } from "../../boards";
import { sAssert } from "../../shared/assert";
import { shuffle } from "../../shared/tools";
import { ClientMoves } from "./bgio-moves";
import { BoardAndRack, Rack, TilePosition } from "./board-and-rack";
import { addToRack, boardIDs, compactRack, onRack } from "./game-actions";
import { BoardData } from "./game-data";
import { ScrabbleBoardProps } from "./scrabble-board-props";
import { CoreTile } from "./core-tile";
import { blank, Letter } from "./letters";

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
    get currentPlayer() {
        return this.props.ctx.currentPlayer;
    }
    get allJoined() { return this.props.allJoined; }
    get config() {return this.props.config;}


    get isMyTurn() : boolean {
        return this.props.playerID === this.currentPlayer;
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
        return this.boardAndRack.isActive(tilePosition(sq));
    }

    move(arg: {from: SquareID,to: SquareID}){
        const from = tilePosition(arg.from);
        const to = tilePosition(arg.to);

        const br = this.boardAndRack;

        const fromLetter = br.getTile(from);
        const toLetter  = br.getTile(to)

        if (to.rack) {
            br.setActiveTile(from, null);
            br.insertIntoRack(to, fromLetter);
        } else  {
            if (toLetter === null) {
                br.setActiveTile(from, null);
                br.setActiveTile(to, fromLetter);
            } else if(br.isActive(to)) {
                br.setActiveTile(from, null);
                br.addToRack(toLetter);
                br.setActiveTile(to, fromLetter);
            }
        }

        this.setState();
    }

    recallRack() {
        for (let row = 0; row < this.board.length; ++row) {
            for (let col = 0; col < this.board[row].length; ++col) {
                let tile = this.board[row][col];
                if (tile?.active) {
                    addToRack(this.rack, tile);
                    this.board[row][col] = null;
                }
            }
        }
        this.setState();
    }

    shuffleRack(){
        shuffle(this.rack);
        compactRack(this.rack);
        this.setState(); // Inefficient as board has not changes.
    }

    /**
     * 
     * @param toSwap Array of the same size as the rack.
     * Tiles are swapped if the correspoing element of toSwap is true.
     */
    swapTiles(toSwap: boolean[]) {
        sAssert(toSwap.length === this.rack.length);
        let toReturn: CoreTile[] = [];
        for(let index = 0; index < toSwap.length; ++index) {
            if(toSwap[index]) {
                const rt = this.rack[index];
                sAssert(rt);
                toReturn.push(rt);
                this.rack[index] = null;
            }
        }

        this.moves.addTilesToBag(toReturn);
    }

    endTurn(score: number) {
        this.moves.setBoardRandAndScore({
            score: score,
            rack: this.boardAndRack.getRack(),
            board: this.boardAndRack.getBoard(),
        });

        sAssert(this.props.events.endTurn);
        this.props.events.endTurn();
    }

    getUnsetBlack(): SquareID | null {
        for (let row = 0; row < this.board.length; ++row) {
            for (let col = 0; col < this.board[row].length; ++col) {
                if(this.board[row][col]?.letter === blank) {
                    return squareID(row, col, boardIDs.main);
                }
            }
        }

        return null;
    }
    
    setBlank(id: SquareID, letter: Letter) {
        sAssert(!onRack(id));

        const sq = this.board[id.row][id.col];
        sAssert(sq && sq.isBlank, "Cannot set blank", "Square=", sq);
        sq.letter = letter;

        this.setState();
    };

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
