import React from "react";
import styled from "styled-components";

const ListRoundDiv = styled.div`
    color: red;
`;

export function LastRoundNotice() : JSX.Element | null {
    return <ListRoundDiv>
        This is the last round!
    </ListRoundDiv>;
}