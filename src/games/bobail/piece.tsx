import React from "react";
import { Counter } from "../../game-support";

interface StringMap { [key: string]: string; }

export const bb = "bb";
export const pl1 = "p1";
export const pl2 = "p2";

const colors: StringMap = {
    [pl1]: "red",
    [pl2]: "green",
    [bb]: "#e0e000",
};

interface Props {
    pieceName: string;
}

export function Piece({ pieceName }: Props): JSX.Element {

    const color = colors[pieceName];

    if (!color) {
        throw new Error(`Unrecognised name for Bobail Piece: '${pieceName}'`);
    }

    return <Counter color={color} />;
}
