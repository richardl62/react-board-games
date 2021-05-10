import React from 'react';
import styled from 'styled-components';
import { applyDefaults } from '../shared/tools';
import { colors as defaultColors } from './colors';

interface BaseProps {
    color: string;
    highlightOnHover: boolean;
    highlightColor: string;
};

const Base = styled.div<BaseProps>`
    width: 50px;
    height: 50px;

    position: relative;
    background-color: ${props => props.color};
    &:hover { 
        background-color: ${props => props.highlightColor}; 
        --hover-helper-display: default;
        }
    z-index: 0;
`;


const HoverHelper = styled.div<{ color: string }>`
    display: var(--hover-helper-display, none);

    position: absolute;
    top: 0;
    left: 0;    

    box-sizing: content-box;
    width: 100%;
    height: 100%;
        
    width: 80%;
    height: 80%;
    margin: 10%;


    background-color: ${props => props.color};

    z-index: 1;
`;

const Element = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;

    z-index: 2;
`;

interface BoardSquareProps {
    children: React.ReactElement;
    color?: string;

    highlightOnHover?: boolean;
    highlightColor?: string;

    onClick?: () => void
}


export function BoardSquare(props: BoardSquareProps) {
    const defaultProps = {
        color: defaultColors.whiteSquare,
        highlightOnHover: true,
        highlightColor: defaultColors.activeSquareHighlight,
    };

    const { children, color, highlightOnHover, highlightColor, onClick } = 
        applyDefaults(props, defaultProps);


    return (
        <Base
            color={color}
            highlightColor={highlightColor}
            highlightOnHover={highlightOnHover}
            onClick={onClick}
        >
            <HoverHelper color={color!} />
            <Element> {children} </Element>
        </Base>
    )
}
