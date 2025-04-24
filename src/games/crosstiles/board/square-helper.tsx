import { JSX } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "styled-components";
import { ClickMoveMarker } from "../../../utils/board/click-move-marker";
import { ClickMoveStart } from "../client-side/actions/types";
import { Letter, bonusLetters } from "../config";
import { squareSize, squareBackgroundColor, tileTextColor, tileBackgroundColor } from "./style";
import { dndRefKludge } from "../../../utils/dnd-ref-kludge";

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

interface SquareHelperProps {
    letter: Letter | null;
    dragRef?: ReturnType<typeof useDrag>[1];
    dropRef?: ReturnType<typeof useDrop>[1];
    onClick?: ()=>void;
    clickMoveDirection?: ClickMoveStart["direction"];
}

export function SquareHelper(props: SquareHelperProps): JSX.Element {
    const { letter, dragRef, dropRef, onClick, clickMoveDirection } = props;
    return <EmptySquare ref={dndRefKludge(dropRef)} onClick={onClick}>
        {letter && <TileDiv ref={dndRefKludge(dragRef)} bonus={bonusLetters.includes(letter)}>
            {letter === "Q" ? "Qu" : letter}
        </TileDiv>
        }
        {!letter && clickMoveDirection && <ClickMoveMarker direction={clickMoveDirection} />}
    </EmptySquare>;
}
