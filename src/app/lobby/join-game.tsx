import React, { useState } from "react";
import { useAsyncCallback } from "react-async-hook";
import { AppGame, MatchID } from "../../app-game-support";
import { AsyncStatus, loadingOrError } from "../../utils/async-status";
import { joinMatch } from "./lobby-tools";
import { addPlayerToHref } from "../url-params";

interface JoinGameProps {
    game: AppGame;
    matchID: MatchID;
    gameFull: boolean;
}

/**
 * For now at least, GameLobby just allows a player to join
 */
export function JoinGame(props: JoinGameProps): JSX.Element {
    const { game, matchID, gameFull } = props;
    const [name, setName] = useState<string>("");
    
    const joinGameCallback = useAsyncCallback(() =>
        joinMatch(game, matchID, name).then(player => {
            const newHref = addPlayerToHref(matchID, player);
            window.location.href = newHref;
        })
    );

    if (loadingOrError(joinGameCallback)) {
        return <AsyncStatus status={joinGameCallback} activity="joining game" />;
    }

    const doSetName = (str: string) => {
        const filtered = str.replace(/\s/g, "");
        console.log(str, filtered);
        setName(filtered);
    };

    const maxLength = 12;
    return <div>
        <input
            type="text"
            title={`Upto ${maxLength} characters which must not be spaces`}
            maxLength={maxLength}
            value={name}
            placeholder='Your name'
            disabled={gameFull}
            onInput={e => doSetName(e.currentTarget.value)}
        />

        <button
            type="button"
            onClick={joinGameCallback.execute}
            disabled={joinGameCallback.loading || gameFull}
        >
            Join
        </button>
    </div>;
}
  
