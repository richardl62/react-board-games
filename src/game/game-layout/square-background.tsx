// This file provides a 'dumb' board square that does not contain any pieces. 
// The idea is that gives the background (including any hightlighting),
// and any pieces 'sit on top of' it. (This can be achieved using CSS
// 'position' and 'z-index'.)

import React from 'react';

import { nonNull } from '../../tools';
import { SquareProperties} from '../game-control';
import styles from './game-layout.module.css';


function BoardSquare({background, gameStatus} : SquareProperties) {
    const { selected, canMoveTo } = gameStatus;
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