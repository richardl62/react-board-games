import React from "react";
import { WrappedGameProps } from ".";
import styled from "styled-components";
import { GameWarnings } from "./show-warning";

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
`;
type PlayerData = WrappedGameProps["playerData"][0];

function statusText(status: PlayerData["status"]) : string {
    switch(status) {
    case "not joined":
        return "";
    case "connected":
        return "";
    case "notConnected":
        return "not connected";
    }
}

export function WaitingForPlayers(props: WrappedGameProps): JSX.Element {

    const playerElements = (id: string) => {
        const {status, name} = props.playerData[id];
        const StatusElem = (status==="notConnected") ? WarningStatus : StandardStatus;
    
        return [
            <Name key={"n-"+name} >{name}</Name>,
            <StatusElem key={"s-"+name} >{statusText(status)}</StatusElem>
        ];
    };

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