// This file provides a 'dumb' board square that does not contain any pieces.
// The idea is that gives the background (including any hightlighting),
// and any pieces 'sit on top of' it. (This can be achieved using CSS
// 'position' and 'z-index'.)

import React from 'react';

import { nonNull } from '../../../shared/tools';
import { SquareProperties, LegalMoveStatus } from '../control';
import styles from './square.module.css';
import styled from 'styled-components'


interface BackgroundProps {
    selected: boolean;
}

const SquareBackground = styled.div<BackgroundProps>`
    width: 100%;
    height: 100%;
    border: ${props => props.selected ? "yellow 8px solid" : "none"};
`;

const PlainSquare = styled(SquareBackground)`
    border: 2px solid var(--board-background, brown);
    background-color: var(--board-white-square, white);
`
const BlackSquare = styled(SquareBackground)`
    background-color: var(--board-black-square, black);
`
const WhiteSquare = styled(SquareBackground)`
    background-color: var(--board-white-square, white);
`

function Background({ background, gameStatus }: SquareProperties) {
    const { selected } = gameStatus;

    if (background === 'plain') {
        return <PlainSquare selected={selected}/>;
    } else if (background === 'checkered-black') {
        return <BlackSquare selected={selected}/>
    } else if (background === 'checkered-white') {
        return <WhiteSquare selected={selected}/>
    }

    return <SquareBackground selected={selected}/>;
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