import React from "react";
import { AppGame } from "../shared/types";
import { MatchLobby } from "./match-lobby";
import { MatchPlayOffline } from "./match-play-offline";
import { MatchPlayOnline } from "./match-play-online";
import { StartMatch } from "./start-match";
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

    return <StartMatch game={game}/>;
}


