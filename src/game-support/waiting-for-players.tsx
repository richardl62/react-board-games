import styled from 'styled-components';
import { Bgio } from '../shared/types';
import { PlayerData, getPlayerData } from './player-data';

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

function playerElements({name, status}: PlayerData) {
    const StatusElem = (status==='offline') ? WarningStatus : StandardStatus;

    return [
        <Name>{name}</Name>,
        <StatusElem>{statusText(status)}</StatusElem>
    ];
}

export function WaitingForPlayers(props: Bgio.BoardProps) {
    const playerData = getPlayerData(props);

    return (
        <div>
            <PlayerDataGrid>
                {playerData.map(playerElements)}
            </PlayerDataGrid>
            <div>
                <a href={window.location.href}>Game Link</a>
                <span> (Use to invite other player)</span>
            </div>
        </div>
    );
}