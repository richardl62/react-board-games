import React from "react";
import { sAssert } from "../shared/assert";
import { AppGame, MatchID, Player } from "../shared/types";
import { GameLobby } from "./game-lobby";
import { GamePlayOffline } from "./game-play-offline";
import { GamePlayOnline } from "./game-play-online";
import { StartGame } from "./start-game";

interface GamePageProps {
    game: AppGame;
    matchID: MatchID | null;
    offline: { nPlayers: number, persist: boolean } | null;
    player: Player | null;
}

function GamePage({ game, matchID, player, offline }: GamePageProps): JSX.Element | null {

    if (offline) {
        return <GamePlayOffline game={game} {...offline} />;
    }

    if (player) {
        sAssert(matchID);
        return <GamePlayOnline game={game} matchID={matchID} player={player} />;
    }

    if (matchID) {
        return <GameLobby game={game} matchID={matchID} />;
    }
    
    return <StartGame game={game} />;
}

export { GamePage };

