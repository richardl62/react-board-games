import { JSX } from "react";
import styled from "styled-components";
import { squareBorder as border } from "./styles";
import { useMatchState } from "../match-state/match-state";
import { SubSquare } from "./sub-square";
import { colors } from "./colors";

const SquareDiv = styled.div`
    display: flex;
    flex-direction: row;

    background-color: ${colors.board.background};

    border-bottom: ${border};

    & > :not(:last-child) {
        border-right: ${colors.board.border} dashed 1px;
    }
`;

export function Square({colValue, height}: {colValue: number, height: number}  ) : JSX.Element {
    const { ctx } = useMatchState();
    return <SquareDiv> 
        {ctx.playOrder.map((playerID) =>
            <SubSquare key={playerID} playerID={playerID} colValue={colValue} height={height} />)
        }
    </SquareDiv>;
}