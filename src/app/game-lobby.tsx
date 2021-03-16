import { useState } from 'react';
import { Game } from './types';
import { Match, MatchList, CreatedMatch, useLobbyClient } from './lobby-client'
// import { matchPath } from '../url-tools'
import { nonNull } from '../tools';
import styles from './app.module.css';
//import { fileURLToPath } from 'url';



// // When includeNames is false, the games are returned as empty spans.
// function makeGridItems(game: Game, matches: Array<Match>) {
//     let items : Array<JSX.Element> = [];
//     const key = () => items.length;

//     for(const index in matches) {
//         const match = matches[index];
//         const address = matchPath(game.name, match.matchID);
//         items.push(<a href={address} key={key()}>{match.matchID}</a>);;
//     };

//     return items;
// }

interface OnlineMatches {
    unset?: true;
    waiting?: true;
    error?: Error;
    matches?: Array<Match>;
 }; 

interface LobbyProps {
    game: Game;
    onlineMatches: OnlineMatches;
}

function Lobby({onlineMatches}: LobbyProps) {
    if(onlineMatches.unset) {
        return <div>[Unset]</div>;
    } else if(onlineMatches.waiting) {
        return <div>...</div>;
    } else if(onlineMatches.error) {
        return <div>{"Error: " + onlineMatches.error.message}</div>;
    } else {
        const matchesDivs = onlineMatches.matches!.map((match, index) =>
            <div key={index}>{match.matchID}</div>
        );
        return <div>{matchesDivs}</div>
    }
}

function GameLobby({ game }: { game: Game }) {
    const numPlayers = 1; // KLUDGE
    const lobbyContext = useLobbyClient();
    const [ onlineMatches, setOnlineMatches ] = useState<OnlineMatches>({unset:true});

    const refresh = () => {
        setOnlineMatches({waiting:true});
        lobbyContext.listMatches(game).then(
            (matchList: MatchList) => setOnlineMatches(matchList)
        ).catch((error: Error) => setOnlineMatches({error: error}));
    }

    const recordCreatedMatch = (createdMatch: CreatedMatch) => {
        let matches = onlineMatches.matches || [];
        //matches.push(createdMatch);
        setOnlineMatches({matches: matches});
    };

    const newGame = () => {
        setOnlineMatches({waiting:true});
        lobbyContext.createMatch(game, numPlayers).then(
            (createdMatch: CreatedMatch) => recordCreatedMatch(createdMatch)
        ).catch((error: Error) => setOnlineMatches({error: error}));
    }

    return (
        <div className={nonNull(styles.gameLobby)}>
            <h1>Online Games</h1>
            <Lobby game={game} onlineMatches={onlineMatches} />
            <button type='button' onClick={newGame}>New Game</button>
            <button type='button' onClick={refresh}>Refresh</button>
        </div>
    );
}


export { GameLobby };
