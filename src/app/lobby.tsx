import { OnlineGame, onlineGames } from './bgio-tools';
import { useOptionsContext } from './options';
import {Game} from './game';

import {nonNull} from '../tools';
import styles from './app.module.css';

function lobbyItems(game: OnlineGame) {
    return [
        <a href={game.address}>{game.id}</a>,
        <span>({game.name})</span>,
        <span>{game.status}</span>,
    ];
}

function Lobby({ games }: {games: Array<Game>}) {
    const {servers} = useOptionsContext();

    return (
        <div className={nonNull(styles.lobby)}>
            <h2>I'm prentending to be a lobby</h2>
            <div className={nonNull(styles.lobbyGrid)}>
                {onlineGames(servers).map(lobbyItems).flat()}
            </div>
        </div>
    );
}

export default Lobby;
