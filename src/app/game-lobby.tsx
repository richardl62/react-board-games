import React from "react";
import { useAsync } from "react-async-hook";
import { makeLobbyClient } from "../bgio/lobby-tools";
import { AppGame } from "../shared/types";
import { WaitingOrError } from "../shared/waiting-or-error";
import { MatchLobbyWithApiInfo } from "./match-lobby";
import { StartMatch } from "./start-match";


interface GameLobbyProps {
    game: AppGame;
}

export function GameLobby(props: GameLobbyProps) : JSX.Element {
    const { game } = props;
    const asyncMatchList = useAsync(() => makeLobbyClient().listMatches(game.name), []);

    const matches = asyncMatchList.result?.matches;
    
    return <div>
        <WaitingOrError status={asyncMatchList} activity="getting list of matches"/>
        {matches && matches.map(
            match => <MatchLobbyWithApiInfo key={match.matchID} game={game} match={match} />
        )}
        <StartMatch game={game} />
    </div>;
}