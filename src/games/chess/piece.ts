// Use 'require' as 'react-chess-pieces' does not contian type info
const ChessPieceImported = require('react-chess-pieces').default;

export function Piece({ pieceName }: {pieceName: string}) {
    return ChessPieceImported({piece:pieceName});
}