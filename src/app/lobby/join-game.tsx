import { JSX, useState } from "react";
import { useAsyncCallback } from "react-async-hook";
import { AppGame, defaultPlayerName, MatchID, Player } from "@/app-game-support";
import { AsyncStatus, loadingOrError } from "@utils/async-status";
import { useSetSearchParam } from "@/url-tools";
import { lobbyClient } from "./lobby-client";

async function joinMatch(game: AppGame, matchID: MatchID, name: string | null = null): Promise<Player> {
    const match = await lobbyClient.getMatch({ 
        gameName: game.name, 
        matchID: matchID.mid
    });

    const players = match.players;
    let index = 0;
    while (players[index].name) {
        ++index;
        if (index === players.length) {
            throw new Error("Match full - cannot join");
        }
    }

    const joinMatchResult = await lobbyClient.joinMatch({
        matchID: matchID.mid,
        playerName: name || "unnamed"
    });

    const credentials = joinMatchResult.playerCredentials;
    const playerID = joinMatchResult.playerID;

    if(!name) {
        await lobbyClient.updatePlayer({
            matchID: matchID.mid,
            playerID: playerID,
            credentials: credentials,
            newName: defaultPlayerName(playerID),
        });
    }

    return {
        id: playerID,
        credentials: credentials,
    };
}

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
    const { addPlayer } = useSetSearchParam();

    const joinGameCallback = useAsyncCallback(() =>
        joinMatch(game, matchID, name).then(player => {
            addPlayer(matchID, player);
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
  
