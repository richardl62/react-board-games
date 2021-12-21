import { LobbyAPI } from "boardgame.io";
import React from "react";
import { useAsync } from "react-async-hook";
import styled from "styled-components";
import { makeLobbyClient } from "../bgio/lobby-tools";
import { AppGame, MatchID } from "../shared/types";
import { WaitingOrError } from "../shared/waiting-or-error";
import { JoinGame } from "./join-game";

const Names = styled.div`
    display: flex;
    /* justify-content: space-between; */
    > *:not(:first-child) {
        margin-left: 5px;
    }
`;

const MissingPlayer=styled.div`
    color: grey;
`;

const NotConnected=styled.div`
    color: red;
`;

const JoinGameDiv=styled.div`
    margin-top: 8px;
`;

interface MatchLobbyWithApiInfoProps {
    game: AppGame;
    match: LobbyAPI.Match;
}

export function MatchLobbyWithApiInfo(props: MatchLobbyWithApiInfoProps) : JSX.Element {
    const { game, match: { players, matchID: matchID_ } } = props;
    const matchID = { mid: matchID_ };

    const names = [];
    let gameFull = true;
    let allConnected = true;
    for(const index in players) {
        const { name, isConnected } = players[index];
        const key = name+index; // Kludge?
        if(!name) {
            gameFull = false;
            names.push(<MissingPlayer>{`<Player${index}>`}</MissingPlayer>);
        } else if (!isConnected) {
            names.push(<NotConnected key={key}>{name}</NotConnected>);
            allConnected = false;
        } else if (name) {
            names.push(<MissingPlayer>{`<Player${index}>`}</MissingPlayer>);
        }
    }

    return <div>
        <Names>{names}</Names>
        {!allConnected && <div>Highlighted players are not connected</div>}

        {!gameFull && 
        <JoinGameDiv>
            <JoinGame game={game} matchID={matchID} />
        </JoinGameDiv>}
    </div>;
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

    console.log("MatchLobby", game.name,  matchID.mid);
    const asyncMatch = useAsync(()=>makeLobbyClient().getMatch(game.name, matchID.mid), []);

    const match = asyncMatch.result;

    return match ? 
        <MatchLobbyWithApiInfo game={game} match={match} /> : 
        <WaitingOrError status={asyncMatch} activity="getting match details"/>;
}