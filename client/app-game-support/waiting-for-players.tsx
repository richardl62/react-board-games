import { JSX } from "react";
import styled from "styled-components";
import { BoardProps } from "./board-props";
import { getPlayerStatus } from "./player-status";

const Name = styled.span`
    /* font-weight: bold; */
`;

const StandardStatus = styled.span`
`;
const WarningStatus = styled(StandardStatus)`
    color: red;
`;

const PlayerDataGrid = styled.div`
    display: grid;
    align-items: start;

    grid-template-columns: max-content max-content;
    column-gap: 0.5em;
`;

export function WaitingForPlayers(props: BoardProps): JSX.Element {

    const gridElems : JSX.Element[] = [];
    let nNotJoined = 0;
    for(const pid of props.ctx.playOrder) {
        const { name, connectionStatus: status } = getPlayerStatus(props.matchStatus.playerData, pid);
        if(status === "not joined") {
            nNotJoined++;
        } else {
            gridElems.push(<Name key={"n-"+pid} >{name+":"}</Name>);
            if(status === "connected") {
                gridElems.push(<StandardStatus key={"s-"+pid} >Connected</StandardStatus>);
            } else {
                gridElems.push(<WarningStatus key={"s-"+pid} >Not connected</WarningStatus>);
            }
        }
    }


    return (
        <div>
            <PlayerDataGrid>{gridElems}</PlayerDataGrid>
            {nNotJoined > 0 && 
                <div>{`Waiting for ${nNotJoined} more player(s)`}</div>
            }
        </div>
    );
}
