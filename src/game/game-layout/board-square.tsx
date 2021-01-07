import React from 'react';

import { nonNull } from '../../tools';
import styles from './game-layout.module.css';

interface BoardSquareProps {
    squareProperties: {checkered:boolean, black: boolean};
    children?: React.ReactNode;
};

function BoardSquare({squareProperties, children} : BoardSquareProps) {
    const {checkered, black} = squareProperties;

    let className = nonNull(styles.square);

    if (!checkered) {
        className += " " + nonNull(styles.plainSquare);
    } else if (black) {
        className += " " + nonNull(styles.blackSquare);
    } else {
        className += " " + nonNull(styles.whiteSquare);
    }

    return <div className={className}> {children} </div>;
}


export default BoardSquare;