import React from 'react';
import styled from 'styled-components';
import { BoardProps } from '../shared/types';
import { GameWarnings } from './show-warning';

const Name = styled.span`
    font-weight: bold;
`;

const StandardStatus = styled.span`
`;
const WarningStatus = styled(StandardStatus)`
    color: red;
    font-style: italic;
`;

const PlayerDataGrid = styled.div`
    display: grid;
    align-items: start;

    grid-template-columns: max-content max-content;
    column-gap: 2em;
    row-gap: 0.5em;
    margin-bottom: 0.5em;
`
type PlayerData = BoardProps['playerData'][0];

function statusText(status: PlayerData['status']) : string {
    switch(status) {
        case 'not joined':
            return '';
        case 'ready':
            return 'Joined';
        case 'offline':
            return 'Offline';
    }
}

export function WaitingForPlayers(props: BoardProps) {

    const playerElements = (id: string) => {
        const {status, name} = props.G.playerData(id);
        const StatusElem = (status==='offline') ? WarningStatus : StandardStatus;
    
        return [
            <Name key={'n-'+name} >{name}</Name>,
            <StatusElem key={'s-'+name} >{statusText(status)}</StatusElem>
        ];
    }

    return (
        <div>
            <PlayerDataGrid>
                {props.ctx.playOrder.map(playerElements)}
            </PlayerDataGrid>
            <GameWarnings {...props} />
            <div>
                <a href={window.location.href}>Game Link</a>
                <span> (Use to invite other player)</span>
            </div>
        </div>
    );
}