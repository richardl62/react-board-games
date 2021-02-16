import { SocketIO, Local } from 'boardgame.io/multiplayer';
import { BoardProps } from 'boardgame.io/react';
import { Client } from 'boardgame.io/react';
import { GameState } from "./game-state";
import makeGame from "./make-game";

type GameDefinition = Parameters<typeof makeGame>[0];

interface FullGameProps {
    gameDefinition: GameDefinition;
    server: string | null;
    bgioDebugPanel: boolean;
    renderGame: (arg: any) => JSX.Element;
    numPlayers: number;
}

function makeClient({ gameDefinition, server, bgioDebugPanel, 
    renderGame, numPlayers }: FullGameProps) {
    let multiplayer;
    if (server) {
        console.log('Connecting to server:', server);
        multiplayer = SocketIO({ server: server });

    } else {
        multiplayer = Local();
    }

    return Client<GameState>({
        multiplayer: multiplayer,
        game: makeGame(gameDefinition),
        board: renderGame,
        debug: bgioDebugPanel,
        numPlayers: numPlayers,
    });
}

interface gamesWithClientArgs {
    renderGame: (props: BoardProps<GameState>) => JSX.Element;
    server: string | null;
    nGames: number;
    bgioDebugPanel: boolean;
}

// Return component(s) that render a game with all component(s) sharing
// the same Bgio client
function gamesWithClient(args : gamesWithClientArgs)
{
    const {nGames} = args;

    const BgClient = makeClient({
        ...args,
        numPlayers: nGames,
    } as any);

    let games = [];
    for (let count = 0; count < nGames; ++count) {
        games.push(<BgClient key={count} playerID={count.toString()} />)
    }

    return games;
}
export default gamesWithClient;