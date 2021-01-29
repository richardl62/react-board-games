import { Lobby } from 'boardgame.io/react';
import { GameDefinition } from '../interfaces';
import makeGame from "./make-game";


interface LobbyGame {
    gameDefinition: GameDefinition;
    component: (props: any) => JSX.Element;  // Render the game
};

interface LobbyProps {
    server: string;
    games: Array<LobbyGame>;
}

function GameLobby({server, games} : LobbyProps) {
    console.log("Lobby running on ", server);
    
    const gameComponents = games.map(game => {
            return {
                game: makeGame(game.gameDefinition),
                board: game.component,
            }
        });
    return (
        <Lobby
            gameServer={server}
            lobbyServer={server}
            gameComponents={gameComponents}
         />
    );
}

export default GameLobby;