import { LobbyAPI } from "boardgame.io";
import React from "react";
import { useAsync } from "react-async-hook";
import styled from "styled-components";
import { makeLobbyClient } from "../bgio/lobby-tools";
import { AppGame, MatchID } from "../shared/types";
import { WaitingOrError } from "../shared/waiting-or-error";
import { JoinGame } from "./join-game";

const MatchHeader = styled.div`
    margin-bottom: 5px;
    span:first-of-type {
        margin-right: 1em;
    }    
`;

type PlayerInfo = LobbyAPI.Match["players"][0];
interface PlayerInfoProps {
    playerInfo: PlayerInfo;
}

function PlayerInfo(props: PlayerInfoProps) : JSX.Element {
    const { name, isConnected } = props.playerInfo;
    return <div> 
        <span>{`Player: ${name}`}</span>
        {!isConnected && <span> (not conected)</span>}
    </div>;
}

interface MatchLobbyWithApiInfoProps {
    game: AppGame;
    match: LobbyAPI.Match;
}

export function MatchLobbyWithApiInfo(props: MatchLobbyWithApiInfoProps) : JSX.Element {
    const { game, match: { players, matchID: matchID_ } } = props;
    const matchID = { mid: matchID_ };

    const playerElems = [];
    for(const playerInfo of players) {
        if(playerInfo.name) {
            playerElems.push(<PlayerInfo key={playerInfo.name} playerInfo={playerInfo}/>);
        }
    }
    const nNotJoined = players.length - playerElems.length;  

    return <div>
        <MatchHeader>
            <span>{game.displayName}</span> 
            <span>match: ${matchID.mid}</span>
        </MatchHeader>

        {playerElems}

        {nNotJoined > 0 && <div>{`${nNotJoined} more player(s) expected`}</div>}
        {nNotJoined > 0 && <JoinGame game={game} matchID={matchID} />}
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