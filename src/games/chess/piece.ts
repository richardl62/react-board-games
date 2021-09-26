// Use 'require' as 'react-chess-pieces' does not contian type info
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ChessPieceImported = require('react-chess-pieces').default;

export function Piece({ pieceName }: {pieceName: string}) : JSX.Element {
    return ChessPieceImported({piece:pieceName});
}