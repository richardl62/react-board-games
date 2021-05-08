import React from 'react';
import styled from 'styled-components';
import { colors } from '../colors';

const Background = styled.div<{color: string}>`

    width: 50px;
    height: 50px;

    position: relative;
    background-color: ${props => props.color};
    &:hover { 
        --backgroundHoverBoarder: 4px;
        border:  var(--backgroundHoverBoarder) solid ${colors.activeSquareHighlight}
        };
`;

const Element = styled.div`

    width: 50px;
    height: 50px;
    position: absolute;

    // KLUDGE?
    top: calc(-1 * var(--backgroundHoverBoarder, 0));
    left: calc(-1 * var(--backgroundHoverBoarder, 0));

    z-index: 1;
`;

interface SquareProps {
    color: string;
    children: React.ReactElement;
    onClick: () => void
}

export function Square({color, children, onClick} : SquareProps) {
    return (
        <Background color={color} onClick={onClick}>
            <Element>
                {children}
            </Element>
        </Background>
        )
}