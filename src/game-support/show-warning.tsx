import React from 'react';
import styled from 'styled-components';
import { BoardProps } from '../shared/types';
import { getPlayerData } from './player-data';

const WarningsDiv = styled.div`
    display: inline;
    *:first-child {
        color: red;
        text-transform: uppercase;
    }

    *:not(:first-child) {
        margin-left: 0.5em;
    }
`;

/** Show warnings, if any, about general (non-game-specifiy) issues.
 * Currently, this the only warning is players being off line.
 */
export function GameWarnings(props: BoardProps) {
    const offline = getPlayerData(props).filter(pd => pd.status === 'offline');
    const warnings = offline.map(pd => `${pd.name} is offline`);

    if(warnings.length === 0) {
        return null;
    }

    return (
        <WarningsDiv>
            <span key='-'>Warnings:</span>
            {warnings.map(w => <span key={w}>{w}</span>)}
        </WarningsDiv>
    );
}
