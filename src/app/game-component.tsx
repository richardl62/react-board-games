import React, { useState } from "react";
import { AppGame } from "../app-game-support";
import { defaultValues } from "../app-game-support/value-specification";
import { GameLobby } from "./lobby/game-lobby";
import { MatchLobby } from "./lobby/match-lobby";
import { MatchPlayOffline } from "./match-play-offline";
import { MatchPlayOnline } from "./match-play-online";
import { OfflineOptions } from "./offline-options";
import * as UrlParams from "./url-params";

export function GameComponent(props: {game : AppGame} ): JSX.Element {
    const { game } = props;
    const {matchID, offline: offlineOptionsFromUrl, player} = UrlParams;

    const [ offlineOptions, setOfflineOptions ] = useState<OfflineOptions | null>(null);

    if (offlineOptions) {
        return <MatchPlayOffline game={game} options={offlineOptions} />;
    }

    if (offlineOptionsFromUrl) {
        const options = {
            ...offlineOptionsFromUrl,
            setupData: defaultValues(game.setupValues || {}),
        };
        return <MatchPlayOffline game={game} options={options} />;
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

    return <GameLobby game={game} setOfflineOptions={setOfflineOptions}/>;
}
