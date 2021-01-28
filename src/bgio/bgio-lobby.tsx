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
    const gameComponents = games.map(game => {
            return {
                game: makeGame(game.gameDefinition),
                board: game.component,
            }
        });
    return (
        <>
        <Lobby
            gameServer={server}
            lobbyServer={server}
            gameComponents={gameComponents}
         />
        <h2> When I work i'll be a lobby </h2>
        <p>I'll run on {server} </p>
        </>
    );
}

export default GameLobby;