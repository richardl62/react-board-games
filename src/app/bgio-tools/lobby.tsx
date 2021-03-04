import { Lobby } from 'boardgame.io/react';

interface Game {
    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes, and also used internally to distinguish different
    // games.
    name: string;
    setup: any; // KLUDGE
    moves: any; // KLUDGE
    renderGame: (arg0: any) => JSX.Element;
};

interface LobbyProps {
    servers: {
        game: string;
        lobby: string;
    };
    games: Array<Game>;
}

function GameLobby({ servers, games }: LobbyProps) {
    console.log("TEMPORARY HACK: explicity setting lobby server");
    servers.lobby = "http://localhost:3000/"; // TEMPORARY
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

export default GameLobby;
