import React, { ReactChild, useState } from "react";
import * as Bgio from "../shared/bgio";
import { AppGame, MatchID } from "../shared/types";
import { addPlayerToHref } from "./url-params";

interface GetPlayerNameProps {
    children: ReactChild;
    nameCallback: (arg: string) => void;
}

function GetPlayerName({ children: child, nameCallback }: GetPlayerNameProps) {

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

interface GameLobbyProps {
    game: AppGame;
    matchID: MatchID;

}
export function GameLobby(props: GameLobbyProps): JSX.Element {
    const { game, matchID } = props;

    const [waiting, setWaiting] = useState(false);
    const [error, setError] = useState<Error|null>(null);

    if (error) {
        return <div>{`Error starting game (${error.message})`}</div>;
    }

    if (waiting) {
        return <div>Waiting for server ...</div>;
    }

    const joinGame = (name: string) => {
        setWaiting(true);

        Bgio.joinMatch(game, matchID, name)
            .then(player => {
                const newHref = addPlayerToHref(player);
                window.location.href = newHref;
            })
            .catch(setError);
    };

    return <GetPlayerName nameCallback={joinGame}>Join</GetPlayerName>;
}
  