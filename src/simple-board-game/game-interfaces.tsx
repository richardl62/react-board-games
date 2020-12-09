/*
GameState: State sent to server (if used) and shared between players.

LcoalState: State that is local to a player.

GameControl: data amd functions do not change.

GameProps:  Properties suppplied by client code when creating a game.
*/
type PieceId = string;
type MakePiece = (arg0: PieceId) => JSX.Element;

type StyleName = 'checkered';
const checkered: StyleName = 'checkered';
type SharedGameState = Array<Array<PieceId|null>>;

interface GameState {
    pieces: SharedGameState;
}

interface LocalState {
    reverseBoardRows: boolean;
}

interface CopyablePieces {
    top: Array<PieceId>;
    bottom: Array<PieceId>;
}
const defaultcopyablePieces = {top:[], bottom:[]};

interface GameControl {

    style?: StyleName,
    borderLabels?: boolean;

    copyablePieces?: CopyablePieces;

    makePiece: MakePiece;
    };


interface GameProps {
    style?: StyleName;
    borderLabels?: boolean;

    pieces: SharedGameState;
    copyablePieces?: CopyablePieces;

    makePiece: MakePiece;
};

function makeGameState(props: GameProps): GameState {
    return {pieces: props.pieces};
}

function makeLocalProps(props: GameProps): LocalState {
    return {reverseBoardRows: false};
}

function makeGameControl(props: GameProps): GameControl {
    return {
        style : props.style,
        borderLabels: Boolean(props.borderLabels),
        copyablePieces: props.copyablePieces ? 
            props.copyablePieces : defaultcopyablePieces,
    
        makePiece: props.makePiece,
    };
}

export {makeGameState, makeLocalProps, makeGameControl, checkered};
export type {GameState, LocalState, GameControl, GameProps, SharedGameState};