import React from 'react';
import { SquareProperties } from '../../interfaces';

import { nonNull } from '../../tools';
import styles from './game-layout.module.css';

interface BoardSquareProps {
    squareProperties: SquareProperties;
    children?: React.ReactNode;
};

function BoardSquare({squareProperties, children} : BoardSquareProps) {
    const {checkered, black, selected, canMoveTo} = squareProperties;

    let className = nonNull(styles.square);

    if (!checkered) {
        className += " " + nonNull(styles.plainSquare);
    } else if (black) {
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