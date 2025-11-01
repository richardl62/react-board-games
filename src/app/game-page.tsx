import { AppGame } from "@/app-game-support";
import { useSearchParamData } from "@/url-tools";
import { JSX, useState } from "react";
import styled from "styled-components";
import { MatchPlayOffline } from "./match-play/match-play-offline";
import { MatchPlayOnline } from "./match-play/match-play-online";
import { OfflineOptions } from "./offline-options";
import { GameLobby } from "./lobby/game-lobby";
import { MatchLobby } from "./lobby/match-lobby";

const OuterDiv = styled.div`
    font-size: 18px;
    font-family: "Times New Roman";

    button, input {
        font-size: 1em;
    }
`;

function InnerGamePage(props: {game : AppGame} ) {
    const { game } = props;
    const {matchID, player} = useSearchParamData();

    // KLUDGE: When the lobby decided that an offline match is needed, it calls setOfflineOptions.
    // This contrasts with online matches for which the lobby simply URL parameters.
    const [ offlineOptions, setOfflineOptions ] = useState<OfflineOptions | null>(null);

    if (offlineOptions) {
        return <MatchPlayOffline game={game} options={offlineOptions} />;
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

// The main page component for a particular game.
// Reachable with a URL like https:/<main-address>/scrabble
export function GamePage(props: {game : AppGame} ): JSX.Element {
    return <OuterDiv>
        <InnerGamePage {...props} />
    </OuterDiv>;
}
