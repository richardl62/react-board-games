import React, { useState } from "react";
import { useAsyncCallback } from "react-async-hook";
import { joinMatch } from "../bgio";
import { AppGame, MatchID } from "../shared/types";
import { addPlayerToHref } from "./url-params";

interface GameLobbyProps {
    game: AppGame;
    matchID: MatchID;
}

/**
 * For now at least, GameLobby just allows a player to join
 */
export function GameLobby(props: GameLobbyProps): JSX.Element {
    const { game, matchID } = props;
    const [name, setName] = useState<string>("");
    
    const joinGameCallback = useAsyncCallback(() =>
        joinMatch(game, matchID, name).then(player => {
            const newHref = addPlayerToHref(player);
            window.location.href = newHref;
        })
    );

    if(joinGameCallback.loading) {
        return <div>Loading</div>;
    }

    if(joinGameCallback.error) {
        return <div>{`ERROR: ${joinGameCallback.error.message}`}</div>;
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
  