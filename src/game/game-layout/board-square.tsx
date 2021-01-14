import React from 'react';

import { nonNull } from '../../tools';
import styles from './game-layout.module.css';

interface BoardSquareProps {

    background: {
        checkered: boolean;
        black: boolean;
    };
    selected: boolean;
    canMoveTo: boolean;

    children?: React.ReactNode;
};

function BoardSquare({background, selected, canMoveTo, children} : BoardSquareProps) {

    let className = nonNull(styles.square);

    if (!background.checkered) {
        className += " " + nonNull(styles.plainSquare);
    } else if (background.black) {
        className += " " + nonNull(styles.blackSquare);
    } else {
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