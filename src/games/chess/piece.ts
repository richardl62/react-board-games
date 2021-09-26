// Use 'require' as 'react-chess-pieces' does not contian type info
const ChessPieceImported = require('react-chess-pieces').default;

export function Piece({ pieceName }: {pieceName: string}) : JSX.Element {
    return ChessPieceImported({piece:pieceName});
}