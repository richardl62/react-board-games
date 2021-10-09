import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {  squareID, SquareID } from "game-support/deprecated/boards";
import { sAssert } from "shared/assert";
import { sameJSON, shuffle } from "shared/tools";
import { ClientMoves } from "./bgio-moves";
import { BoardAndRack, Rack, TilePosition } from "./board-and-rack";
import { addToRack, boardIDs, compactRack, onRack } from "./game-actions";
import { BoardData } from "../game-data";
import { ScrabbleBoardProps } from "../scrabble-board-props";
import { CoreTile } from "../core-tile";
import { blank, Letter } from "../letters";
import { ScrabbleConfig } from "../scrabble-config";

export type { Rack };

type UseStateResult<S> =  [S, Dispatch<SetStateAction<S>>];

function tilePosition(sq: SquareID) : TilePosition {
    if(onRack(sq)) {
        return {rack: {pos: sq.col}};
    } else {
        return {board: sq};
    }
}

/**
 * Data and functions to support Scrabble
 */
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

        this.boardAndRack = new BoardAndRack(boardState[0], rackState[0]);
        this.bag = [...props.G.bag];
    }

    private readonly props: ScrabbleBoardProps;
    private readonly boardState: UseStateResult<BoardData>;
    private readonly rackState: UseStateResult<Rack>;
    private boardAndRack: BoardAndRack;
    private bag: CoreTile[];

    private get moves() : ClientMoves {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.props.moves as any;
    }

    get board(): BoardData {
        return this.boardAndRack.getBoard();
    }

    get rack(): Rack {
        return this.boardAndRack.getRack();
    }

    get playOrder(): string[] {
        return this.props.ctx.playOrder;
    }

    get playerID(): string {
        sAssert(this.props.playerID);
        return this.props.playerID;
    }

    get currentPlayer(): string {
        return this.props.ctx.currentPlayer;
    }

    get allJoined(): boolean {
        return this.props.allJoined;
    }

    get config() : ScrabbleConfig {
        return this.props.config;
    }

    get isMyTurn() : boolean {
        return this.props.playerID === this.currentPlayer;
    } 

    get nTilesInBag() : number {
        return this.bag.length;
    }

    /** 
    * Report whether there are active tiles on the board.
    * 
    * Active tiles are those taken from the rack. 
    *
    * Note: For most of the game this is equivalent to checking if the rank has 
    * gaps. But difference can occur at the end of the game when the bag is emtpy.
    */
    tilesOut(): boolean {
        return !!this.board.find(row => row.find(sq => sq?.active));
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

    move(arg: {from: SquareID,to: SquareID}) : void {
        const from = tilePosition(arg.from);
        const to = tilePosition(arg.to);
        if(sameJSON(from,to)) {
            return;
        }

        const br = this.boardAndRack;
        const fromLetter = br.getTile(from);
        const toLetter  = br.getTile(to);

        // Do nothing if attempting to move onto an inactive tile.
        if (toLetter === null) {
            br.setActiveTile(from, null);
            br.setActiveTile(to, fromLetter);
        } else if (to.rack) {
            br.setActiveTile(from, null);
            br.insertIntoRack(to, fromLetter);
        } else if (br.isActive(to)) {
            br.setActiveTile(from, null);
            br.addToRack(toLetter);
            br.setActiveTile(to, fromLetter);
        }

        this.setState();
    }

    recallRack(): void {
        for (let row = 0; row < this.board.length; ++row) {
            for (let col = 0; col < this.board[row].length; ++col) {
                const tile = this.board[row][col];
                if (tile?.active) {
                    addToRack(this.rack, tile);
                    this.board[row][col] = null;
                }
            }
        }
        this.setState();
    }

    shuffleRack(): void {
        shuffle(this.rack);
        compactRack(this.rack);
        this.setState(); // Inefficient as board has not changes.
    }

    /**
     * @param toSwap - Array of the same size as the rack.
     * Tiles are swapped if the correspoing element of toSwap is true.
     * (The true elements of toSwap must correspond to non-null elememts 
     * of the rack).
     */
    swapTiles(toSwap: boolean[]): void {
        const rack = this.boardAndRack.getRack();

        for (let ri = 0; ri < toSwap.length; ++ri) {
            if(toSwap[ri]) {
                const old = rack[ri];
                sAssert(old, "Attempt to swap non-existant tile");
                this.bag.push(old);
                rack[ri] = this.bag.shift()!;
            }
        }
        this.boardAndRack.resetRack(rack);
        shuffle(this.bag);
    }

    endTurn(score: number): void {
        const rack = this.boardAndRack.getRack();
        for(let ri = 0; ri < rack.length; ++ri) {
            if(!rack[ri]) {
                rack[ri] = this.bag.pop() || null;
            }
        }
        this.moves.setBoardRandAndScore({
            score: score,
            rack: this.boardAndRack.getRack(),
            board: this.boardAndRack.getBoard(),
            bag: this.bag,
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
    
    setBlank(id: SquareID, letter: Letter): void  {
        sAssert(!onRack(id));

        const sq = this.board[id.row][id.col];
        sAssert(sq && sq.isBlank, "Cannot set blank", "Square=", sq);
        sq.letter = letter;

        this.setState();
    }

    private setState() {
        this.boardState[1](this.board);
        this.rackState[1](this.rack);
    }
}

export function useScrabbleData(props: ScrabbleBoardProps) : ScrabbleData {
    sAssert(props.playerID);
    const playableTiles = props.G.playerData[props.playerID].playableTiles;

    const boardState = useState<BoardData>([[]] /*KLUDGE: Any empty array, e.g. [], gives crashes*/);
    const rackState = useState<Rack>([]);

    useEffect(()=>{
        boardState[1](props.G.board);
        rackState[1](playableTiles);
    }, [props.G.board, playableTiles]);

    return new ScrabbleData(props, boardState, rackState);
}
