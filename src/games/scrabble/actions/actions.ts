import { sAssert } from "shared/assert";
import { sameJSON, shuffle } from "shared/tools";
import { ClientMoves } from "./bgio-moves";
import { BoardAndRack, Rack, TilePosition } from "./board-and-rack";
import { addToRack, boardIDs, compactRack, onRack } from "./game-actions";
import { BoardData, GameData } from "./game-data";
import { CoreTile } from "./core-tile";
import { blank, Letter } from "../config";
import { ScrabbleConfig } from "../config";
import { GeneralGameProps } from "shared/general-game-props";

export type { Rack };

export interface SquareID {
    row: number;
    col: number;
    boardID: string;
}


function tilePosition(sq: SquareID) : TilePosition {
    if(onRack(sq)) {
        return {rack: {pos: sq.col}};
    } else {
        return {board: sq};
    }
}

/** Game state required for a particular players (so includes the rack only
 * for that players).
 */
export interface PlayerGameState {
    board: BoardData,
    rack: Rack,
}

export class Actions {
    constructor(
        props: GeneralGameProps<GameData>, 
        config: ScrabbleConfig,
        playerGameState: PlayerGameState,
        setPlayerGameState: (arg: PlayerGameState) => void,
    ) {
        this.generalProps = props;
        this.config = config;
        this.setPlayerGameState = setPlayerGameState;

        this.boardAndRack = new BoardAndRack(playerGameState.board, playerGameState.rack);
        this.bag = [...props.G.bag];
    }

    readonly generalProps: GeneralGameProps<GameData>;
    readonly config: ScrabbleConfig;
    private readonly setPlayerGameState:  (arg: PlayerGameState) => void;
    private boardAndRack: BoardAndRack;
    private bag: CoreTile[];

    private get moves() : ClientMoves {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.generalProps.moves as any;
    }

    get board(): BoardData {
        return this.boardAndRack.getBoard();
    }

    get rack(): Rack {
        return this.boardAndRack.getRack();
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

    score(pid: string) : number {
        const playerData = this.generalProps.G.playerData[pid];
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
    get allowSwapping() : boolean {
        return this.nTilesInBag >= this.config.rackSize;
    } 
    
    swapTiles(toSwap: boolean[]): void {
        sAssert(this.allowSwapping);
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

        this.endTurn(0);
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

        sAssert(this.generalProps.events.endTurn);
        this.generalProps.events.endTurn();
    }

    getUnsetBlack(): SquareID | null {
        for (let row = 0; row < this.board.length; ++row) {
            for (let col = 0; col < this.board[row].length; ++col) {
                if(this.board[row][col]?.letter === blank) {
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
    
    setBlank(id: SquareID, letter: Letter): void  {
        sAssert(!onRack(id));

        const sq = this.board[id.row][id.col];
        sAssert(sq && sq.isBlank, "Cannot set blank", "Square=", sq);
        sq.letter = letter;

        this.setState();
    }

    private setState() {
        this.setPlayerGameState({
            board: this.board,
            rack: this.rack,
        });
    }
}
