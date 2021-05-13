import React, { ReactNode } from 'react';
import { useDrag, useDrop  } from 'react-dnd'
import styled from 'styled-components';
import { BoardSquare, BoardSquareProps } from './board-square';

const PIECE = 'piece';

interface DraggablePieceProps {
    children: ReactNode;
}

const StyledDraggablePiece = styled.div<{ isDragging: boolean }>`
  width: 50px;
  height: 50px;

  font-size: 40px; // KLUDGE

  text-align: center;
  margin: auto;
`
export function DraggablePiece({ children }: DraggablePieceProps) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: PIECE,
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    return (
        <StyledDraggablePiece ref={drag} isDragging={isDragging}>
            {children}
        </StyledDraggablePiece>);
}


export function BoardSquareDnD(props: BoardSquareProps) {
    const [/*{ isOver }*/, dropRef] = useDrop({
        accept: PIECE,
        drop: () => alert("Dropped"),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    let boardSquareProps = { ...props };
    delete boardSquareProps.children;

    return <div ref={dropRef}>
        <BoardSquare  {...boardSquareProps} >
            <DraggablePiece>
                {props.children}
            </DraggablePiece>
        </BoardSquare>
    </div>;
}
  