import { LobbyAPI } from "boardgame.io";
import React from "react";
import { useAsync } from "react-async-hook";
import { makeLobbyClient } from "../bgio/lobby-tools";
import { AppGame, MatchID } from "../shared/types";
import { WaitingOrError } from "../shared/waiting-or-error";
import { JoinGame } from "./join-game";

interface MatchLobbyWithApiInfoProps {
    game: AppGame;
    match: LobbyAPI.Match;
}

export function MatchLobbyWithApiInfo(props: MatchLobbyWithApiInfoProps) : JSX.Element {
    const { game, match: { players, matchID } } = props;

    return <div>
        {players.map(player=>{
            <div>{player.toString()}</div>;
        })}

        <JoinGame game={game} matchID={{mid: matchID}} />
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

    return <>
        <WaitingOrError status={asyncMatch} activity="getting match details"/>
        {match && <MatchLobbyWithApiInfo game={game} match={match} />}
    </>;
}