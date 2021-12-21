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

interface MatchLobbyWithApiInfoProps {
    game: AppGame;
    match: LobbyAPI.Match;
}

export function MatchLobbyWithApiInfo(props: MatchLobbyWithApiInfoProps) : JSX.Element {
    const { game, match: { players, matchID: matchID_ } } = props;
    const matchID = { mid: matchID_ };

    const names = [];
    let gameFull = true;
    for(const index in players) {
        const { name } = players[index];
        const key = name+index; // Kludge?
        if(name) {
            names.push(<span key={key}>{name}</span>);
        } else {
            gameFull = false;
            names.push(<MissingPlayer>{`<Player${index}>`}</MissingPlayer>);
        }
    }

    return <div>
        <Names>{names}</Names>

        {!gameFull && <JoinGame game={game} matchID={matchID} />}
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