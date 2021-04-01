import { Lobby as BgioLobby } from 'boardgame.io/react';
import { Servers, AppGame } from './types';

interface LegacyLobbyProps {
    games: Array<AppGame>;
    servers: Servers;
}

function Lobby({ games, servers }: LegacyLobbyProps) {

    console.log("Lobby running on ", servers);

    const gameComponents = games.map(game => {
        return {
            game: game,
            board: game.renderGame,
        }
    });
    return (
        <BgioLobby
            gameServer={servers.game}
            lobbyServer={servers.lobby}
            gameComponents={gameComponents}
        />
    );
}

export default Lobby;
