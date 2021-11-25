import React, { ReactChild, useState } from "react";
import { sAssert } from "../shared/assert";
import * as Bgio from "../shared/bgio";
import { AppGame, MatchID, Player } from "../shared/types";
import { GamePlayOffline } from "./game-play-offline";
import { GamePlayOnline } from "./game-play-online";
import { StartGame } from "./start-game";
import { addPlayerToHref } from "./url-params";


interface GetPlayerNameProps {
  children: ReactChild;
  nameCallback: (arg: string) => void;
}

function GetPlayerName({children: child, nameCallback}: GetPlayerNameProps) {

    const [name, setName] = useState<string>("");
    return (
        <div>
            <div>
                <label>Name</label>
                <input 
                    value={name} 
                    placeholder='Player name' 
                    onInput={e => setName(e.currentTarget.value)} 
                />

                <button 
                    type="button"
                    onClick={() => nameCallback(name)}
                >
                    {child}
                </button>

            </div>
        </div>);
}

interface GamePageProps {
  game: AppGame;
  matchID: MatchID | null;
  offline: {nPlayers: number, persist: boolean} | null;
  player: Player | null;
}

function GamePage({game, matchID, player, offline}: GamePageProps): JSX.Element | null {
    const [waiting, setWaiting] = useState(false);
    const [error, setError] = useState<Error|null>(null);


    const joinGame = (name: string) => {
        sAssert(matchID);
        setWaiting(true);

        Bgio.joinMatch(game, matchID, name)
            .then(player => {
                const newHref = addPlayerToHref(player);
                window.location.href = newHref;
            })
            .catch(setError);
    };

    if (error) {
        return <div>{`Error starting game (${error.message})`}</div>;
    }

    if (waiting) {
        return <div>Waiting for server ...</div>;
    }

    if (matchID && !player) {
        return <GetPlayerName nameCallback={joinGame}>Join</GetPlayerName>;
    }

    if(offline) {
        return <GamePlayOffline game={game} {...offline} />;
    }

    if (matchID && player) {
        return  <GamePlayOnline game={game} matchID={matchID} player={player} />;
    }


    return <StartGame game={game}  />;
}

export { GamePage };

