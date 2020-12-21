import { FC } from 'react'
// Use 'require' as 'react-chess-pieces' does not type info
const ReactChessPieces:any = require('react-chess-pieces'); 

interface ChessProps {
    piece: string;
}

const Chess:FC<ChessProps> = ReactChessPieces.default;

export { Chess }
