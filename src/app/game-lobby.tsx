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
    match: Match;
}
function MatchLink({ match }: MatchLinkProps) {
    const lobbyClient = useLobbyClient();
    const path = matchPath(lobbyClient.game.name, match.matchID);
    return (<div>
        <a href={path}>{match.matchID}</a>
    </div>
    );
};
interface GameListProps {
    onlineMatches: OnlineMatches;
}

function GameList({ onlineMatches }: GameListProps) {
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
                    <MatchLink match={match} key={index} />
                )}
            </div>
        </>
    );
}

function Players() {
    const lobbyClient = useLobbyClient();
    const [playerInfo, setPlayerInfo] = useState<string|null>(null);
    const activeMatch = lobbyClient.activeMatch;
    if(activeMatch && !playerInfo) {
        setPlayerInfo('...');
        (async () => {
            await lobbyClient.getMatch(activeMatch)
                .then(match => {
                    //console.log("match", match);
                    setPlayerInfo(JSON.stringify(match.players));
                })
                .catch(error => {
                    console.log("error", error);
                    setPlayerInfo(JSON.stringify('Error' + error.message));
                });

        })();
    }

    const joinMatch = (p: number) => {
        lobbyClient.joinActiveMatch(p.toString()).then(data=>{
            //console.log("joinMatch", data);
            setPlayerInfo(null);
        }).catch(err => {
            console.log("joinMatch", err);
            setPlayerInfo(playerInfo + '\njoinMatch error: ' + err.message);
        });
    }
    return (<>
            <h1>Player info</h1>
            <button type='button' onClick={()=>joinMatch(0)}>Join (0)</button>
            <button type='button' onClick={()=>joinMatch(1)}>Join (1)</button>
            <div>{playerInfo}</div>
          </>);
}

function GameLobby({ game }: { game: Game; }) {
    const lobbyClient = useLobbyClient();
    const numPlayers = 2; // KLUDGE
    const [onlineMatches, setOnlineMatches] = useState<OnlineMatches>({ unset: true });

    const listMatches = () => {
        setOnlineMatches({ waiting: true });
        lobbyClient.listMatches().then(
            (matchList: MatchList) => setOnlineMatches(matchList)
        ).catch((error: Error) => setOnlineMatches({ error: error }));
    }

    const addCreatedMatch = (createdMatch: CreatedMatch) => {
        // KLUDGE: Use getMatch to get the default propeties for a newly created match.
        lobbyClient.getMatch(createdMatch.matchID).then(
            (match: Match) => {
                let matches = [match];
                if (onlineMatches.matches) {
                    matches.push(...onlineMatches.matches);
                }
                setOnlineMatches({ matches: matches });
            }
        );
    };

    const newMatch = () => {
        setOnlineMatches({ waiting: true });
        lobbyClient.createMatch(numPlayers).then(
            (createdMatch: CreatedMatch) => addCreatedMatch(createdMatch)
        ).catch((error: Error) => setOnlineMatches({ error: error }));
    }

    return (
        <div className={nonNull(styles.gameLobby)}>
            <div className={nonNull(styles.gameLobbyButtons)}>
                <button type='button' onClick={newMatch}>New Match</button>
                <button type='button' onClick={listMatches}>List Matches</button>
            </div>
            <GameList onlineMatches={onlineMatches} />
            <Players/>
        </div>
    );
}

export { GameLobby };
