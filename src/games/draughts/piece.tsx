import React from 'react';
import { Counter } from '../../layout/counter';

function pieceColor(black: boolean) {
    return black ? 'black' :
        'rgb(230 220 200)'  // kludge? Depends (sort of) on color of squares on board
        ;
}
interface KingProps {
    isBlack: boolean
}

function King({ isBlack }: KingProps) {
    return (<Counter 
        color={pieceColor(isBlack)}
        text={'\u2654'}
        textColor={pieceColor(!isBlack)}
    />);
}

interface DraughtsProps {
    pieceName: string;
}

function Piece({ pieceName }: DraughtsProps) {

    const isBlack = pieceName.toLowerCase() === 'b';
    const isKing = pieceName === pieceName.toUpperCase();;

    return (
        isKing ? <King isBlack={isBlack} /> :
            <Counter color={pieceColor(isBlack)} />
    );
}

export { Piece };