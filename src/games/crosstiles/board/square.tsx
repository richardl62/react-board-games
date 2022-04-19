import React from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import { useCrossTilesContext } from "../client-side-actions/cross-tiles-context";
import { SquareID } from "../client-side-actions/types";
import { bonusLetters, Letter } from "../config";
import { squareBackgroundColor, squareSize, tileBackgroundColor, tileTextColor } from "./style";

const DnDType = "tile";

const EmptySquare = styled.div`
    height: ${squareSize};
    width: ${squareSize};

    background-color: ${squareBackgroundColor};
`;


const TileDiv = styled.div<{bonus: boolean}>`
    height: ${squareSize};
    width: ${squareSize};
    font-size: calc(${squareSize}*0.8);

    color: ${tileTextColor};
    background-color: ${tileBackgroundColor};
    
    text-align: center;

    text-decoration: ${props => props.bonus? "underline" : "none"};
`;


interface SquareProps {
    id: SquareID,
    letter: Letter | null;
}

export function Square(props: SquareProps) : JSX.Element {
    const {letter, id} = props;
    const { dispatch } = useCrossTilesContext();

    const [{isDragging}, dragRef] = useDrag(() => ({
        type: DnDType,
        item: id,
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    }));

    const [, dropRef] = useDrop(() => ({
        accept: DnDType,
        drop: (draggedID: SquareID) => 
            dispatch({
                type: "move",
                data: { from: draggedID, to: id},
            }),
    }));

    return <EmptySquare ref={dropRef}>
        {letter && !isDragging && 
            <TileDiv ref={dragRef} bonus={bonusLetters.includes(letter)}>
                {letter}
            </TileDiv>
        }
    </EmptySquare>;
}
