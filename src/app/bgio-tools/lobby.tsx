import { LobbyClient } from 'boardgame.io/client';

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
    options: {
        lobbyGame: string | null,
    };
}

function GameLobby({ servers, options }: LobbyProps) {
    console.log("Lobby running on ", servers);
    const game = options.lobbyGame;


    const lobbyClient = new LobbyClient({ server: servers.lobby});
    
    lobbyClient.listGames()
      .then(console.log) // => ['chess', 'tic-tac-toe']
      .catch(console.error);

    return (
        <div>
            <p>When I grow up, I want to be a lobby</p>
            <p>I'll play {game || "all the games"}</p>
        </div>
    );
}

export default GameLobby;
