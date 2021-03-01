import { SocketIO, Local } from 'boardgame.io/multiplayer';
import { BoardProps } from 'boardgame.io/react';
import { Client } from 'boardgame.io/react';
import { GameState } from "./game-state";
import makeGame from "./make-game";

type GameDefinition = Parameters<typeof makeGame>[0];

interface makeClientArg {
    game: GameDefinition;
    server: string | null;
    bgioDebugPanel: boolean;
    renderGame: (arg: any) => JSX.Element;
    numPlayers: number;
}

function makeClient({ game, server, bgioDebugPanel, 
    renderGame, numPlayers }: makeClientArg) {
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

interface gamesWithClientArg extends makeClientArg {
    renderGame: (props: BoardProps<GameState>) => JSX.Element;
    nGames: number;
    bgioDebugPanel: boolean;
}

// Return component(s) that render a game with all component(s) sharing
// the same Bgio client
function gamesWithClient(arg : gamesWithClientArg)
{
    const {nGames} = arg;

    const BgClient = makeClient({
        ...arg,
        numPlayers: nGames,
    } as any);

    let games = [];
    for (let count = 0; count < nGames; ++count) {
        games.push(<BgClient key={count} playerID={count.toString()} />)
    }

    return games;
}
export default gamesWithClient;