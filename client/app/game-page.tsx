import { AppGame } from "@/app-game-support";
import { useSearchParamData } from "@/url-tools";
import { JSX, useState } from "react";
import styled from "styled-components";
import { MatchPlayOffline } from "./match-play/offline/match-play-offline";
import { MatchPlayOnline } from "./match-play/online/match-play-online";
import { OfflineOptions } from "./offline-options";
import { GameLobby } from "./lobby/game-lobby";
import { MatchLobby } from "./lobby/match-lobby";
import { defaultValues } from "@/option-specification/tools";

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

    const startingOfflineOptions = useStartingOfflineOptions(game);
    const [ offlineOptions, setOfflineOptions ] = useState(startingOfflineOptions);

    if (offlineOptions) {
        return <MatchPlayOffline game={game} options={offlineOptions} />;
    }

    if ( player && matchID ) {
        return <MatchPlayOnline game={game} matchID={matchID} player={player} />;
    }

    if ( player && !matchID ) {
        return <div>Unexpected URL parameters: Player ID provided without Match ID</div>;
    }

    if( matchID ) {
        return <MatchLobby game={game} matchID={matchID} />;
    }

    return <GameLobby game={game} setOfflineOptions={setOfflineOptions}/>;
}

function useStartingOfflineOptions(game : AppGame) : OfflineOptions | null {
    const { isOffline } = useSearchParamData();
    
    if (!isOffline) {
        return null;
    }

    const setupData = game.options ? defaultValues(game.options) : {};
    return {
        numPlayers: isOffline.numPlayers,
        passAndPlay: true,
        setupData,
    };
}

// The main page component for a particular game.
// Reachable with a URL like https:/<main-address>/scrabble
export function GamePage(props: {game : AppGame} ): JSX.Element {
    return <OuterDiv>
        <InnerGamePage {...props} />
    </OuterDiv>;
}
