import React from 'react';

import { nonNull } from '../../tools';
import { SquareBackground } from '../game-control/game-control';
import styles from './game-layout.module.css';

interface BoardSquareProps {

    background: SquareBackground;
    selected: boolean;
    canMoveTo: boolean;

    children?: React.ReactNode;
};

function BoardSquare({background, selected, canMoveTo, children} : BoardSquareProps) {

    let className = nonNull(styles.square);

    if (background === 'plain') {
        className += " " + nonNull(styles.plainSquare);
    } else if (background === 'checkered-black') {
        className += " " + nonNull(styles.blackSquare);
    } else if (background === 'checkered-white') {
        className += " " + nonNull(styles.whiteSquare);
    }

    if (selected) {
        className += " " + nonNull(styles.selectedSquare);
    }

    if (canMoveTo) {
        className += " " + nonNull(styles.canMoveTo);
    }

    return (
        <div className={className}>
            {children}
        </div>
        );
}


export default BoardSquare;