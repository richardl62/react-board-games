import React from "react";
import { AppGame } from "../shared/types";
import { GameLobby } from "./game-lobby";
import { GamePlayOffline } from "./game-play-offline";
import { GamePlayOnline } from "./game-play-online";
import { StartGame } from "./start-game";
import * as UrlParams from "./url-params";


export function gameComponent(game : AppGame): JSX.Element {

    const {matchID, offline, player} = UrlParams;

    if (offline) {
        return <GamePlayOffline game={game} {...offline} />;
    }

    if ( player && !matchID ) {
        alert("Unexpected URL parameters");
    }

    if( !matchID ) {
        return <StartGame game={game} />;
    }

    if ( !player ) {
        return <GameLobby game={game} matchID={matchID} />;
    }

    return <GamePlayOnline game={game} matchID={matchID} player={player} />;
}


