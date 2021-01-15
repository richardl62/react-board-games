import React from "react";
import { PieceName, GameType } from '../interfaces';
import Bobail from './bobail';
import Chess from './chess';
import Draughts from './draughts';


interface PieceProps {
    pieceName: PieceName;
    gameType: GameType;
}


function Piece({ pieceName, gameType }: PieceProps) {

    if (gameType === 'bobail') {
        return <Bobail pieceName={pieceName} />;
    }

    if (gameType === 'chess') {
        return <Chess pieceName={pieceName} />;
    }

    if (gameType === 'draughts') {
        return <Draughts pieceName={pieceName} />;
    }

    throw new Error('unrecognised game type');
}


export default Piece;