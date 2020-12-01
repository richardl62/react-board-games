import React, {FC} from 'react';
import './bobail.css';

interface PieceParams {
    name: string;
};

const PieceNames = ['p1', 'p2', 'bb'];

const Piece:FC<PieceParams> = ({name}: PieceParams) => {
    if(!PieceNames.find(p => p === name)) {
        throw new Error(`Unrecognised name for Bobail Piece: '${name}'`)
    }
    const className = "bobail bobail-" + name; 
    return <div className={className}/>;
}

export default Piece;
