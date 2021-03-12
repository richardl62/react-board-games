import { Lobby } from 'boardgame.io/react';
import { Servers, Game } from '../types';

interface LegacyLobbyProps {
    games: Array<Game>;
    servers: Servers;
}

function LegacyLobby({ games, servers }: LegacyLobbyProps) {

    console.log("Lobby running on ", servers);

    const gameComponents = games.map(game => {
        return {
            game: game,
            board: game.renderGame,
        }
    });
    return (
        <Lobby
            gameServer={servers.game}
            lobbyServer={servers.lobby}
            gameComponents={gameComponents}
        />
    );
}

export { LegacyLobby };
