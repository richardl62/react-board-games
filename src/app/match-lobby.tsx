import React, { useState } from "react";
import { useAsyncCallback } from "react-async-hook";
import { joinMatch } from "../bgio";
import { AppGame, MatchID } from "../shared/types";
import { WaitingOrError, waitingOrError } from "../shared/waiting-or-error";
import { addPlayerToHref } from "./url-params";

interface MatchLobbyProps {
    game: AppGame;
    matchID: MatchID;
}

/**
 * For now at least, GameLobby just allows a player to join
 */
export function MatchLobby(props: MatchLobbyProps): JSX.Element {
    const { game, matchID } = props;
    const [name, setName] = useState<string>("");
    
    const joinGameCallback = useAsyncCallback(() =>
        joinMatch(game, matchID, name).then(player => {
            const newHref = addPlayerToHref(player);
            window.location.href = newHref;
        })
    );

    if(waitingOrError(joinGameCallback)) {
        return <WaitingOrError status={joinGameCallback} />;
    }

    return <div>
        <label>Name</label>
        <input
            value={name}
            placeholder='Player name'
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
  