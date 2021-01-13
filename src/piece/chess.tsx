import React from 'react';
// Use 'require' as 'react-chess-pieces' does not type info
const ReactChessPieces:any = require('react-chess-pieces'); 
const ChessPiece = ReactChessPieces.default;

interface Props {
    pieceName: string;
}

function Chess({pieceName}: Props) {
    return <ChessPiece piece={pieceName} />;
}

export default Chess
