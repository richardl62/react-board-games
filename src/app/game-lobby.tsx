import { useState } from 'react';
import { Game } from './types';
import { Match, MatchList, CreatedMatch, useLobbyClient } from './lobby-client'
import { nonNull } from '../tools';
import styles from './app.module.css';
import { matchPath } from '../url-tools';

interface OnlineMatches {
    unset?: true;
    waiting?: true;
    error?: Error;
    matches?: Array<Match>;
};

interface MatchLinkProps {
    game: Game;
    match: Match;
}
function MatchLink({ game, match }: MatchLinkProps) {
    const path = matchPath(game.name, match.matchID);
    return (<div>
        <a href={path}>{match.matchID}</a>
    </div>
    );
};
interface GameListProps {
    game: Game;
    onlineMatches: OnlineMatches;
}

function GameList({ game, onlineMatches }: GameListProps) {
    if (onlineMatches.unset) {
        return null;
    }

    if (onlineMatches.waiting) {
        return <div>Waiting for server ...</div>;
    }

    if (onlineMatches.error) {
        return <div>{'Error: ' + onlineMatches.error.message}</div>
    }


    const matches = onlineMatches.matches!;

    return (
        <>
            <h1>Online Matches</h1>
            <div>
                {(matches.length === 0) ? 'No matches found' : null}
                {matches.map((match, index) => 
                    <MatchLink game={game} match={match} key={index} />
                )}
            </div>
        </>
    );
}

function GameLobby({ game }: { game: Game }) {
    const numPlayers = 1; // KLUDGE
    const lobbyContext = useLobbyClient();
    const [onlineMatches, setOnlineMatches] = useState<OnlineMatches>({ unset: true });

    const listMatches = () => {
        setOnlineMatches({ waiting: true });
        lobbyContext.listMatches(game).then(
            (matchList: MatchList) => setOnlineMatches(matchList)
        ).catch((error: Error) => setOnlineMatches({ error: error }));
    }

    const startCreatedMatch = (createdMatch: CreatedMatch) => {
        const { matchID } = createdMatch;
        const address = matchPath(game.name, matchID);
        window.location.href = address;
    };

    const newMatch = () => {
        setOnlineMatches({ waiting: true });
        lobbyContext.createMatch(game, numPlayers).then(
            (createdMatch: CreatedMatch) => startCreatedMatch(createdMatch)
        ).catch((error: Error) => setOnlineMatches({ error: error }));
    }

    return (
        <div className={nonNull(styles.gameLobby)}>
            <div className={nonNull(styles.gameLobbyButtons)}>
                <button type='button' onClick={newMatch}>New Match</button>
                <button type='button' onClick={listMatches}>List Matches</button>
            </div>
            <GameList game={game} onlineMatches={onlineMatches} />
        </div>
    );
}

export { GameLobby };
