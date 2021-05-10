import React from 'react';
import { colors as defaultColors } from "./colors";
import styled from 'styled-components';
import { deepCopyArray, setDefault } from '../shared/tools';

const Corner = styled.div<{width: string}>`
    width: ${props => props.width};
    height: ${props => props.width};
`

const BorderElement = styled.div<{color: string}>`
    color: ${props => props.color};
    font-family: 'Helvetica'; // No special reason
`;


const Grid = styled.div<{
    nCols: number, 
    gridGap: string,
    borderWidth: string,
    backgroundColor: string,
    }>`        
    display: inline-grid;
    align-items: center;
    justify-items: center;

    background-color: ${props => props.backgroundColor};
    grid-template-columns: ${props => `repeat(${props.nCols},auto)`};
    
    grid-gap: ${props => props.gridGap};
    border: ${props => props.borderWidth} solid ${props => props.backgroundColor};
`; 


function rowCol(array: Array<Array<any>>) {
    return {
        nRows: array.length,
        nCols: array[0].length,
    }
}

interface BoardProps {
    /** The elements that form the squares of the board.
     * Should be given keys
    */
    squares: Array<Array<JSX.Element>>;
    
    borderLabels?: boolean;
    reverseRows?: boolean;

    gridGap?: string;
    borderWidth?: string;

    colors?: {
        background: string;
        labels: string;
    } 
}

export function RectangularBoard(props: BoardProps) {  
    const squares = props.squares;
    const borderLabels = setDefault(props.borderLabels, false);
    const reverseRows = setDefault(props.reverseRows, false);

    const gridGap = setDefault(props.gridGap, 'none');
    const borderWidth = setDefault(props.borderWidth, "4%"); // arbitray
    const colors = setDefault(props.colors, {
        background: defaultColors.boardBackground,
        labels: defaultColors.boardBorderLabels,
    });

    const { nRows, nCols } = rowCol(squares);

    // elems will include border elements and squares.
    let elems: Array<Array<JSX.Element>> = deepCopyArray(squares);
    
    const borderElement = (label:string|number, keyStart: string) => {

        return <BorderElement color={colors.labels} 
            key={keyStart + label}
        >{label}</BorderElement>;
    }

    if(borderLabels) {
        // Add side labels.
        for (let row = 0; row < nRows; ++row) {
            elems[row].unshift(borderElement(row, "leftMargin"));
            elems[row].push(borderElement(row, "rightMargin"));
        }
    }

    if(reverseRows) {
        elems.reverse();
    }

    if (borderLabels) {
        // Add top/bottom rows
        const makeRow = (keyStart: string) => {
            let elems = [];
            for (let col = 0; col < nCols; ++col) {
                const label = String.fromCharCode(65 + col);
                elems[col] = borderElement(label, keyStart);
            }            
            elems.unshift(<Corner width={borderWidth} key={keyStart+'left'}/>)
            elems.push(<Corner width={borderWidth} key={keyStart+'Right'}/>)
            return elems;
        }
        elems.unshift(makeRow("topMargin"))
        elems.push(makeRow("bottonMargin"))
    }

    return (
        <Grid
            nCols={elems[0].length}
            gridGap={gridGap}
            borderWidth={borderLabels ? '0' : borderWidth}
            backgroundColor={colors.background}
        >
            {elems}
        </Grid>
    );
}
