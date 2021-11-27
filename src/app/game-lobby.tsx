import React, { ReactChild, useState } from "react";
import * as Bgio from "../bgio/bgio";
import { AppGame, MatchID } from "../shared/types";
import { useWaitingOrError, WaitingOrError } from "../shared/waiting-or-error";
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

    const [ waitingOrError, setWaitingOrError ] = useWaitingOrError();

    if (waitingOrError) {
        return <WaitingOrError status={waitingOrError}
            waitingMessage="hurry up"
            errorMessage="Bah!"
        />;
    }

    const joinGame = (name: string) => {
        setWaitingOrError("waiting");

        Bgio.joinMatch(game, matchID, name)
            .then(player => {
                const newHref = addPlayerToHref(player);
                window.location.href = newHref;
            })
            .catch(setWaitingOrError);
    };

    return <GetPlayerName nameCallback={joinGame}>Join</GetPlayerName>;
}
  