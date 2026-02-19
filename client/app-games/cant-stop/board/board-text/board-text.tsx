import { JSX } from "react";
import { useMatchState } from "../../match-state/match-state";
import { ColumnsText } from "./columns-text";
import { BlockedSquaresText } from "./blocked-squares-text";
import styled from "styled-components";

const OuterDiv = styled.div`
    margin: 2px;
    border: 1px solid black;
`
export function BoardText() : JSX.Element {
    const {
        ctx: {currentPlayer}, 
        getPlayerName, 
    } = useMatchState();
    
    // Very crude board for now.
    return <OuterDiv>
        <div>{`Current player: ${getPlayerName(currentPlayer)}`}</div>
        <BlockedSquaresText/>
        <ColumnsText/>
    </OuterDiv>
}


