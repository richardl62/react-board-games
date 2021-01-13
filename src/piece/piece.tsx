import React from "react";
import { GameType } from '../interfaces';
import Bobail from './bobail';
import Chess from './chess';
import Draughts from './draughts'; 

interface PieceProps {
    pieceName: string;
    gameType: GameType;
}

function unrecognisedGameType(x: never): never {
    throw new Error('unrecognised game type');
}

function Piece ({pieceName, gameType}: PieceProps )  {
    if(gameType === 'bobail') {
        return <Bobail pieceName={pieceName} />;
    }

    if(gameType === 'chess') {
        return <Chess pieceName={pieceName} />;
    }

    if(gameType === 'draughts') {
         return <Draughts pieceName={pieceName} />;
    }

    unrecognisedGameType(gameType)
}

export default Piece;

