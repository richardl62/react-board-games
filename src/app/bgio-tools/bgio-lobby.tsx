// import { Lobby } from 'boardgame.io/react';
// import makeGame from "./make-game";

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
    console.log("Lobby running on ", servers);

    // const gameComponents = games.map(game => {
    //     return {
    //         game: game,
    //         board: game.component,
    //     }
    // });
    // return (
    //     <Lobby
    //         gameServer={servers.game}
    //         lobbyServer={servers.lobby}
    //         gameComponents={gameComponents}
    //     />
    // );
    return <div>I'm a Lobby</div>
}

export default GameLobby;
