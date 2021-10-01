import React, { ReactNode } from "react";
import styled from "styled-components";

// https://stackoverflow.com/questions/6780614/css-how-to-position-two-elements-on-top-of-each-other-without-specifying-a-hei
const Stack = styled.div`
    display: inline-grid;

    align-items: center;
    justify-items: center;

    * {
        grid-row: 1;
        grid-column: 1;
    }
`;

export const Border = styled.div<{width: string, color: string, hoverColor: string}>`
    display:block;

    height: 100%;
    width: 100%;
    border-width: ${props => props.width}; 
    border-style: solid;
    border-color: ${props => props.color};

    :hover {
        border-color: ${props => props.hoverColor};
    }
`;

interface Props {
    children: ReactNode;
}

export function PieceHolder(props: Props): JSX.Element {

    const { children } = props;

    return <Stack>
        {children}
    </Stack>;
}
