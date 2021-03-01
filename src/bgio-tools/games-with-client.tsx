import { SocketIO, Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { GameState } from "./game-state";
import makeGame from "./make-game";

type GameDefinition = Parameters<typeof makeGame>[0];

interface MakeClientParam {
    game: GameDefinition;
    server: string | null;
    bgioDebugPanel: boolean;
    renderGame: (arg: any) => JSX.Element;
    numPlayers: number;
}

function makeClient({ game, server, bgioDebugPanel, 
    renderGame, numPlayers }: MakeClientParam) {
    console.log("makeCient",arguments[0]);
    let multiplayer;
    if (server) {
        console.log('Connecting to server:', server);
        multiplayer = SocketIO({ server: server });

    } else {
        multiplayer = Local();
    }

    return Client<GameState>({
        multiplayer: multiplayer,
        game: makeGame(game),
        board: renderGame,
        debug: bgioDebugPanel,
        numPlayers: numPlayers,
    });
}

interface gamesWithClientArg extends MakeClientParam {
    game: GameDefinition;
    server: string | null;
    bgioDebugPanel: boolean;
    renderGame: (arg: any) => JSX.Element;
    nGames: number;
}

// Return component(s) that render a game with all component(s) sharing
// the same Bgio client
function gamesWithClient(
    {game, server, bgioDebugPanel, renderGame, nGames}: gamesWithClientArg)
{
    const BgClient = makeClient({
        game: game,
        server: server,
        bgioDebugPanel: bgioDebugPanel,
        renderGame: renderGame,
        numPlayers: nGames,
    });

    let games = [];
    for (let count = 0; count < nGames; ++count) {
        games.push(<BgClient key={count} playerID={count.toString()} />)
    }

    return games;
}
export default gamesWithClient;