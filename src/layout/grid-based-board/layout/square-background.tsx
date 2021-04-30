// This file provides a 'dumb' board square that does not contain any pieces.
// The idea is that gives the background (including any hightlighting),
// and any pieces 'sit on top of' it. (This can be achieved using CSS
// 'position' and 'z-index'.)

import React from 'react';

import { SquareProperties, LegalMoveStatus } from '../control';
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

const CanMoveTo = styled.div`
    background-color: rgb(0, 255, 0, .8); /* opaque  green */;
    border-radius: 50%;

    /* make blob-size + 2*top-left-offsett = 100% */
    --blob-size: 40%;
    --top-left-offsett: calc((100% - var(--blob-size)) / 2);
   
    position: absolute;
    height: var(--blob-size);
    width: var(--blob-size);

    top: var(--top-left-offsett);
    left: var(--top-left-offsett);

    z-index: 2;
`;

const CannotMoveTo = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
   
    height: 100%;
    width: 100%;

    cursor: not-allowed;
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
    
    if (legalMoveStatus === LegalMoveStatus.Legal) {
        return <CanMoveTo />;
    }

    if (legalMoveStatus === LegalMoveStatus.Illegal) {
        return <CannotMoveTo />;
    }

    return null;
}

export { Background, CanMoveToMarker };