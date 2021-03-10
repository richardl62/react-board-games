import { OnlineGame, onlineGames } from './bgio-tools';
import { useOptionsContext } from './options';
import {Game} from './game';

import {nonNull} from '../tools';
import styles from './app.module.css';


function makeGridItems(onlineGame: OnlineGame) {
    return [
        <a href={onlineGame.address}>{onlineGame.id}</a>,
        <span>({onlineGame.name})</span>,
        <span>{onlineGame.status}</span>,
    ];
}

function Lobby({ games }: {games: Array<Game>}) {
    const names = games.map(g => g.name);

    const {servers} = useOptionsContext();
    const onlineGames_= onlineGames(servers).filter(g => names.includes(g.name)); 

    const gridItems = onlineGames_.map(makeGridItems);

    return (
        <div className={nonNull(styles.lobby)}>
            <h2>I'm prentending to be a lobby</h2>
            <div className={nonNull(styles.lobbyGrid)}>
                {gridItems.flat()}
            </div>
        </div>
    );
}


export default Lobby;
