import React from "react";
import styled from "styled-components";

interface GridProps {
    nCols: number;
    backgroundColor: string;
    gridGap: string;
    borderWidth: string;
}

const Grid = styled.div<GridProps>`
    display: inline-grid;
    grid-template-columns: repeat(${props => props.nCols}, auto);
    background-color: ${props => props.backgroundColor};
    grid-gap: ${props => props.gridGap};
    padding: ${props => props.borderWidth};
`;


const nElements = (rn: React.ReactNode) : number =>
    Array.isArray(rn) ? rn.length : 1;

interface Props {
    nCols?: number;
    backgroundColor?: string;
    gridGap?: string;
    borderWidth?: string;

    children: React.ReactNode;
}

/**
 * WORK IN PROGRESS
 * @param props - To be finalised
 * @returns A grid of elements
 */
export function BoarderedGrid(props: Props) : JSX.Element {
    const children = props.children;
    const nCols = props.nCols || nElements(children);
    const backgroundColor = props.backgroundColor || "none";
    const gridGap = props.gridGap || "none";
    const borderWidth = props.borderWidth || gridGap;


    return <Grid nCols={nCols} backgroundColor={backgroundColor} gridGap={gridGap} borderWidth={borderWidth}>
        {children}
    </Grid>;
}