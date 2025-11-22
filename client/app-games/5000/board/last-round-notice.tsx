import { JSX } from "react";
import styled from "styled-components";

const ListRoundDiv = styled.div`
    color: red;
`;

export function LastRoundNotice() : JSX.Element | null {
    // The reason that the last round is not enforced 
    // was to avoid having to implement the endGame event.
    // This was a KLUDGE - see comment in endTurnNotBust.
    return <ListRoundDiv>
        Target score reached. This is the last round.
    </ListRoundDiv>;
}