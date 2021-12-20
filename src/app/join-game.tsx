import React, { useState } from "react";
import { useAsyncCallback } from "react-async-hook";
import { joinMatch } from "../bgio";
import { AppGame, MatchID } from "../shared/types";
import { WaitingOrError, waitingOrError } from "../shared/waiting-or-error";
import { addPlayerToHref } from "./url-params";

interface JoinGameProps {
    game: AppGame;
    matchID: MatchID;
}

/**
 * For now at least, GameLobby just allows a player to join
 */
export function JoinGame(props: JoinGameProps): JSX.Element {
    const { game, matchID } = props;
    const [name, setName] = useState<string>("");
    
    const joinGameCallback = useAsyncCallback(() =>
        joinMatch(game, matchID, name).then(player => {
            const newHref = addPlayerToHref(matchID, player);
            window.location.href = newHref;
        })
    );

    if(waitingOrError(joinGameCallback)) {
        return <WaitingOrError status={joinGameCallback} activity="joining game"/>;
    }

    return <div>
        <input
            value={name}
            placeholder='Your name'
            onInput={e => setName(e.currentTarget.value)}
        />

        <button
            type="button"
            onClick={joinGameCallback.execute}
            disabled={joinGameCallback.loading}
        >
            Join
        </button>
    </div>;
}
  