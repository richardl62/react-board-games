import React from 'react';

export interface GridBoardSquare {
    background: JSX.Element;
    piece: JSX.Element;
};

interface SquareProps extends GridBoardSquare {
    onClick: () => void;
} 

function Square({piece, onClick} : SquareProps ) {
    return <div> onClick={onClick} piece</div>;
}

interface GridBoardProps {
    squares: Array<Array<GridBoardSquare>>;
    onClick: (row: number, col: number) => void;
}

export function GridBoard({squares, onClick}: GridBoardProps) {
    let elements = [];
    
    for(let row = 0; row < squares.length; ++row) {
        for(let col = 0; col < squares[row].length; ++col) {
            const square = squares[row][col];
            const onClickSquare = () => onClick(row, col);
            elements.push(<Square {...square} onClick={onClickSquare} />); 
        }
    }   

    return <div> {elements} </div>;
}