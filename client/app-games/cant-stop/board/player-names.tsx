import { JSX } from "react";
import { useMatchState } from "../match-state/match-state";
import styled from "styled-components";
import { playerColor } from './styles';

const Names = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
`;

const Name = styled.div<{color: string}>`
    color: ${props => props.color};
    font-size: 1.5em;
    font-weight: bold;
`
export function PlayerNames() : JSX.Element {
    const { ctx, getPlayerName } = useMatchState();

    return <Names>
        {ctx.playOrder.map((pid) =>
            <Name key={pid} color={playerColor(pid)}>
                {getPlayerName(pid)}
            </Name>
        )}

    </Names>
}
