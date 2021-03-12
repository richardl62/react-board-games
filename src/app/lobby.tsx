import { OnlineGame } from './types'
import { useLobbyContext } from './lobby-context';
import { Game } from './types';

import { nonNull } from '../tools';
import styles from './app.module.css';

// When includeNames is false, the games are returned as empty spans.
function makeGridItems(onlineGames: Array<OnlineGame>, includeNames: boolean) {
    let items : Array<JSX.Element> = [];
    const key = () => items.length;

    for(const index in onlineGames) {
        const onlineGame = onlineGames[index];
        items.push(<a href={onlineGame.address} key={key()}>{onlineGame.id}</a>);
        items.push(<span key={key()}>{includeNames ? '(' + onlineGame.name + ')' : null}</span>);
        items.push(<span key={key()}>{onlineGame.status}</span>);
    };

    return items;
}

interface LobbyProps {
    games: Array<Game>;
    showNames?: boolean; // Defaults to true;
}
function Lobby(props: LobbyProps) {
    const games = props.games;
    const showNames = props.showNames !== false;

    const names = games.map(g => g.name);

    const lobbyAccess = useLobbyContext();
    const allGames = lobbyAccess.listMatches(games);
    const selectedGames = allGames.filter(g => names.includes(g.name));

    const gridItems = makeGridItems(selectedGames, showNames);

    return (
        <div className={nonNull(styles.lobby)}>
            <div className={nonNull(styles.lobbyGrid)}>
                {gridItems.flat()}
            </div>
        </div>
    );
}

function GameLobby({ game }: { game: Game }) {
    const lobbyContext = useLobbyContext();
    const onClick = () => {
        const newGame = lobbyContext.createMatch(game, 1);
        if(!newGame) {} // Suppress unused variable warning
        //window.location.href = newGame.address;
    }

    return (
        <div className={nonNull(styles.gameLobby)}>
            <h1>Online Games</h1>
            <Lobby games={[game]} showNames={false} />
            <button type='button' onClick={onClick}>New</button>
        </div>
    );
}


export { Lobby, GameLobby };
