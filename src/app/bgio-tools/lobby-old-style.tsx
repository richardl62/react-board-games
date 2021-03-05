import { useContext } from 'react';
import { Lobby } from 'boardgame.io/react';
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

interface LobbyProps {
    games: Array<Game>;
}

function GameLobby({ games }: LobbyProps) {
    const { servers } = useContext(OptionsContext);
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
