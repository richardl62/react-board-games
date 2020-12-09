/*
GameState: State sent to server (if used) and shared between players.

LcoalState: State that is local to a player.

GameProps:  Properties suppplied by client code when creating a game.
*/
type PieceId = string;
type MakePiece = (arg0: PieceId) => JSX.Element;

type StyleName = 'checkered';
const checkered: StyleName = 'checkered';

type SharedGameState = Array<Array<PieceId|null>>;

interface CopyablePieces {
    top: Array<PieceId>;
    bottom: Array<PieceId>;
}

interface GameProps {
    style?: StyleName;
    borderLabels?: boolean;

    pieces: SharedGameState;
    copyablePieces: CopyablePieces | null;

    makePiece: MakePiece;
};


export {checkered};
export type {GameProps, SharedGameState};