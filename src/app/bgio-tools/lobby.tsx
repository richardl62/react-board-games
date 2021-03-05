import { LobbyClient } from 'boardgame.io/client';
import { useContext } from 'react';
import { OptionsContext } from '../options';

interface Game {
    // The name of the game, e.g. "Chess" or "Chess - 5-A-Side" etc.  Use for
    // display purposes, and also used internally to distinguish different
    // games.
    name: string;
    setup: any; // KLUDGE
    moves: any; // KLUDGE
    renderGame: (arg0: any) => JSX.Element;
};

interface GamesLobbyProps {
    games: Array<Game>;
}

function GameLobby({ games }: GamesLobbyProps) {
    const {servers, lobbyGame} = useContext(OptionsContext);
    console.log("Lobby running on ", servers);


    const lobbyClient = new LobbyClient({ server: servers.lobby});
    
    lobbyClient.listGames()
      .then(console.log) // => ['chess', 'tic-tac-toe']
      .catch(console.error);

    return (
        <div>
            <p>When I grow up, I want to be a lobby</p>
            <p>I'll play {lobbyGame || "all the games"}</p>
        </div>
    );
}

export default GameLobby;
