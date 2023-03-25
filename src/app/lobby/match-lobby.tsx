import { LobbyAPI } from "boardgame.io";
import React, { ReactNode } from "react";
import { useAsync } from "react-async-hook";
import styled from "styled-components";
import { AppGame, nonJoinedPlayerName, MatchID } from "../../app-game-support";
import { AsyncStatus } from "../../utils/async-status";
import { BoxWithLegend } from "../../utils/box-with-legend";
import { JoinGame } from "./join-game";
import { makeLobbyClient } from "./lobby-tools";

const Names = styled.div`
    display: flex;
    /* justify-content: space-between; */
    > *:not(:first-child) {
        margin-left: 5px;
    }
`;

const NotConnectedDiv = styled.div`
    > *:first-child {
        color: red;
    }

    > *:not(:first-child) {
        margin-left: 0.25em;
    }
`;

interface NotConnectedProps {
    children: ReactNode;
}

const MatchLobbyDiv = styled.div`
    > *:last-child {
        margin-top: 8px;
    }
`;

function NotConnected(props: NotConnectedProps) {
    const { children } = props;
    return <NotConnectedDiv>
        <span>Warning:</span>
        {children}
        <span>is not connected</span>
    </NotConnectedDiv>;

}

interface MatchLobbyWithApiInfoProps {
    game: AppGame;
    match: LobbyAPI.Match;
}

export function MatchLobbyWithApiInfo(props: MatchLobbyWithApiInfoProps) : JSX.Element {
    const { game, match: { players, matchID: matchID_ } } = props;
    const matchID = { mid: matchID_ };

    const allNames : JSX.Element[] = [];
    const notConnected : JSX.Element[] = [];
    let gameFull = true;

    for(const index in players) {
        const { name, isConnected } = players[index];

        const key = name+index; // Kludge?
        const elem = <span key={key}>{name || nonJoinedPlayerName}</span>;
        allNames.push(elem);

        if(!name) {
            gameFull = false;
        } else if (!isConnected) {
            notConnected.push(elem);
        }
    }

    return <BoxWithLegend legend="Existing Game">
        <MatchLobbyDiv>
            <Names><span>Players:</span> {allNames}</Names>
            {notConnected.length > 0 && <NotConnected>{notConnected}</NotConnected>}

            {gameFull ?
                <div>All players have joined</div> :
                <JoinGame game={game} matchID={matchID} gameFull={gameFull} />
            }
        </MatchLobbyDiv>
    </BoxWithLegend>;
}

interface MatchLobbyProps {
    game: AppGame;
    matchID: MatchID;
}

/**
 * For now at least, GameLobby just allows a player to join
 */
export function MatchLobby(props: MatchLobbyProps): JSX.Element {
    const { game, matchID } = props;

    const asyncMatch = useAsync(()=>makeLobbyClient().getMatch(game.name, matchID.mid), []);

    const match = asyncMatch.result;

    return match ? 
        <MatchLobbyWithApiInfo game={game} match={match} /> : 
        <AsyncStatus status={asyncMatch} activity="getting match details"/>;
}
