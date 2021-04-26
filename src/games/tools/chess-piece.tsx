import React from 'react';
// Use 'require' as 'react-chess-pieces' does not contian type info
const ChessPieceImported = require('react-chess-pieces').default;

interface Props {
    pieceName: string;
}

function ChessPiece({ pieceName }: Props) {
    return <ChessPieceImported piece={pieceName} />;
}

export { ChessPiece };
