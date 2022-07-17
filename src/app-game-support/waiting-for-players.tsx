import React from "react";
import styled from "styled-components";
import { WrappedGameProps } from "./wrapped-game-props";

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

export function WaitingForPlayers(props: WrappedGameProps): JSX.Element {

    const gridElems : JSX.Element[] = [];
    let nNotJoined = 0;
    for(const pid of props.ctx.playOrder) {
        const {status, name} = props.playerData[pid];
        if(status === "not joined") {
            nNotJoined++;
        } else {
            gridElems.push(<Name key={"n-"+name} >{name+":"}</Name>);
            if(status === "connected") {
                gridElems.push(<StandardStatus key={"s-"+name} >Connected</StandardStatus>);
            } else {
                gridElems.push(<WarningStatus key={"s-"+name} >Not connected</WarningStatus>);
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
