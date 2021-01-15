import React from 'react';

import { nonNull } from '../../tools';
import { SquareBackground } from '../game-control/game-control';
import styles from './game-layout.module.css';

interface BoardSquareProps {
    background: SquareBackground;
    selected: boolean;
    canMoveTo: boolean;
};

// This is a 'dumb' square that does not contain any pieces. The idea
// is that pieces go in a separate element that 'sits' on to of this.
function BoardSquare({background, selected, canMoveTo} : BoardSquareProps) {

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

    return (<div className={className} />);
}


export default BoardSquare;