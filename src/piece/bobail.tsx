import React from 'react';
import { Counter } from './counter';

interface StringMap { [key: string]: string; }

const colors : StringMap = {
    p1: 'red',
    p2: 'green',
    bb: '#e0e000',
};

interface Props {
    name: string;
}

function Bobail({name}: Props) {

    const color = colors[name];

    if(!color) {
        throw new Error(`Unrecognised name for Bobail Piece: '${name}'`)
    }
 
    return <Counter color={color}/>;
}

export default Bobail;