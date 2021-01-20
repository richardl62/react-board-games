import React from 'react';
import { Counter } from './counter';

function pieceColor(black: boolean) {
    return black ? 'black' :
        'rgb(230 220 200)'  // kludge? Depemds (sort of) on color of squares on board
        ;
}

interface Props {
    pieceName: string;
}

function Draughts({ pieceName }: Props) {

    const isBlack = pieceName.toLowerCase() === 'b';
    const isKing = pieceName === pieceName.toUpperCase();;

    return (
        <Counter color={pieceColor(isBlack)}
            text={isKing ? "K" : null}
            textColor={pieceColor(!isBlack)}
        />
    );
}

export default Draughts;