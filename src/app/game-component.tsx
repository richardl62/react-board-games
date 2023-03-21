import React from "react";
import { AppGame } from "../app-game-support";
import { GameLobby } from "./lobby/game-lobby";
import { MatchLobby } from "./lobby/match-lobby";
import { MatchPlayOffline } from "./match-play-offline";
import { MatchPlayOnline } from "./match-play-online";
import * as UrlParams from "./url-params";

export function gameComponent(game : AppGame): JSX.Element {

    const {matchID, offline, player} = UrlParams;

    if (offline) {
        return <MatchPlayOffline game={game} {...offline} />;
    }

    if ( player && matchID ) {
        return <MatchPlayOnline game={game} matchID={matchID} player={player} />;
    }

    if ( player && !matchID ) {
        alert("Unexpected URL parameters");
    }

    if( matchID ) {
        return <MatchLobby game={game} matchID={matchID} />;
    }

    return <GameLobby game={game}/>;
}
