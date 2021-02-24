import React from 'react';
import { Counter } from './counter';

function pieceColor(black: boolean) {
    return black ? 'black' :
        'rgb(230 220 200)'  // kludge? Depemds (sort of) on color of squares on board
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

function Draughts({ pieceName }: DraughtsProps) {

    const isBlack = pieceName.toLowerCase() === 'b';
    const isKing = pieceName === pieceName.toUpperCase();;

    return (
        isKing ? <King isBlack={isBlack} /> :
            <Counter color={pieceColor(isBlack)} />
    );
}

export default Draughts;