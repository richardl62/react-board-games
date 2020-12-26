import React from 'react';
// Use 'require' as 'react-chess-pieces' does not type info
const ReactChessPieces:any = require('react-chess-pieces'); 
const ChessPiece = ReactChessPieces.default;

interface Props {
    name: string;
}

function Chess({name}: Props) {
    return <ChessPiece piece={name} />;
}

export default Chess
