// This file provides a 'dumb' board square that does not contain any pieces.
// The idea is that gives the background (including any hightlighting),
// and any pieces 'sit on top of' it. (This can be achieved using CSS
// 'position' and 'z-index'.)

import React from 'react';

import { nonNull } from '../../shared/tools';
import { SquareProperties, LegalMoveStatus } from '../control';
import styles from './square.module.css';

function Background({ background, gameStatus }: SquareProperties) {
    const { selected } = gameStatus;
    let className = nonNull(styles.squareBackground);

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

    return (<div className={className} />);
}

function CanMoveToMarker({ gameStatus }: SquareProperties) {
    const { legalMoveStatus } = gameStatus;
    
    let className = null;
    if (legalMoveStatus === LegalMoveStatus.Legal) {
        className = nonNull(styles.canMoveTo);
    }

    if (legalMoveStatus === LegalMoveStatus.Illegal) {
        className = nonNull(styles.cannotMoveTo);
    }

    return className ? <div className={className} /> : null;
}

export { Background, CanMoveToMarker };