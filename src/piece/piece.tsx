import React from "react";
import { GameType } from '../interfaces';
import Bobail from './bobail';
import Chess from './chess';
import Draughts from './draughts'; 

interface PieceProps {
    name: string;
    gameType: GameType;
}

function unrecognisedGameType(x: never): never {
    throw new Error('unrecognised game type');
}

function Piece ({name, gameType}: PieceProps )  {
    if(gameType === 'bobail') {
        return <Bobail name={name} />;
    }

    if(gameType === 'chess') {
        return <Chess name={name} />;
    }

    if(gameType === 'draughts') {
         return <Draughts name={name} />;
    }

    unrecognisedGameType(gameType)
}

export default Piece;

