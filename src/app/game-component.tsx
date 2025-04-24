import { JSX, useState } from "react";
import styled from "styled-components";
import { AppGame } from "../app-game-support";
import { defaultValues } from "./option-specification/tools";
import { GameLobby } from "./lobby/game-lobby";
import { MatchLobby } from "./lobby/match-lobby";
import { MatchPlayOffline } from "./match-play-offline";
import { MatchPlayOnline } from "./match-play-online";
import { OfflineOptions } from "./offline-options";
import * as UrlParams from "./url-params";

const OuterDiv = styled.div`
    font-size: 18px;
    font-family: "Times New Roman";

    button, input {
        font-size: 1em;
    }
`;
function InnerGameComponent(props: {game : AppGame} ) {
    const { game } = props;
    const {matchID, offlineData: offlineOptionsFromUrl, player} = UrlParams;

    const [ offlineOptions, setOfflineOptions ] = useState<OfflineOptions | null>(null);

    if (offlineOptions) {
        return <MatchPlayOffline game={game} options={offlineOptions} />;
    }

    if (offlineOptionsFromUrl) {
        const options = {
            ...offlineOptionsFromUrl,
            setupData: defaultValues(game.options || {}),
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

export function GameComponent(props: {game : AppGame} ): JSX.Element {
    return <OuterDiv>
        <InnerGameComponent {...props} />
    </OuterDiv>;
}
