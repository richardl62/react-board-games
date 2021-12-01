import React from "react";
import styled from "styled-components";
import { MoveHistoryElement } from "../actions/global-game-state";

const Name = styled.div`
    font-weight: bold;
    padding-right: 0.5em;
`;
const StyledMoveHistory = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    font-family: helvetica;
    font-size: 14px;
`;

const Warning = styled.span`
    margin-left: 0.5em;
    color: red;
`;

interface MoveHistoryProps {
    moveHistory: MoveHistoryElement [];
}

export function MoveHistory(props: MoveHistoryProps): JSX.Element {
    const { moveHistory } = props;
    return <StyledMoveHistory>
        {moveHistory.map((elem, index) =>
            [
                <Name key={"n"+index}>{elem.name + ": "}</Name>,
                <TurnDescription key={"t"+index} elem={elem} />
            ]
        )}
    </StyledMoveHistory>;
}

interface TurnDescriptionProps {
    elem: MoveHistoryElement;
}
function TurnDescription(props: TurnDescriptionProps) : JSX.Element {
    const { elem } = props;
    if(elem.pass) {
        return <div>Passed</div>;
    }

    if(elem.swapTiles) {
        return <div>Swapped tiles</div>;
    }

    return <div>
        <span>{`Played '${elem.word}'' for ${elem.score}`}</span>
        {!elem.inWordList && <Warning>Invalid word</Warning>}
    </div>;

}
