import React from 'react';
import { Counter } from './counter';

function pieceColor(black: boolean) {
    return black ? 'black' : 
        'rgb(230 220 200)'  // kludge? Depemds (sort of) on color of squares on board
    ;
}

interface Props {
    name: string;
}

function Draughts({name}: Props) {

    const isBlack = name.toLowerCase() === 'b';
    const isKing =  name === name.toUpperCase();;

    return (
        <Counter color={pieceColor(isBlack)}
            text={isKing ? "K" : null}
            textColor={pieceColor(!isBlack)}
        />
    );
}

export default Draughts;