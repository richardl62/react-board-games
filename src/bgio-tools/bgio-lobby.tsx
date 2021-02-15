import { Lobby } from 'boardgame.io/react';
import makeGame from "./make-game";

type GameDefinition = Parameters<typeof makeGame>[0];

interface LobbyGame {
    gameDefinition: GameDefinition;
    component: (props: any) => JSX.Element;  // Render the game
};

interface LobbyProps {
    servers: {
        game: string;
        lobby: string;
    };
    games: Array<LobbyGame>;
}

function GameLobby({ servers, games }: LobbyProps) {
    console.log("Lobby running on ", servers);

    const gameComponents = games.map(game => {
        return {
            game: makeGame(game.gameDefinition),
            board: game.component,
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
