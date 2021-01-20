import React from 'react';
import { Counter } from './counter';

interface StringMap { [key: string]: string; }

const colors: StringMap = {
    p1: 'red',
    p2: 'green',
    bb: '#e0e000',
};

interface Props {
    pieceName: string;
}

function Bobail({ pieceName }: Props) {

    const color = colors[pieceName];

    if (!color) {
        throw new Error(`Unrecognised name for Bobail Piece: '${pieceName}'`)
    }

    return <Counter color={color} />;
}

export default Bobail;