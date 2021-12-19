import React from "react";
import { AppGame, MatchID } from "../shared/types";
import { JoinGame } from "./join-game";

interface MatchLobbyProps {
    game: AppGame;
    matchID: MatchID;
}

/**
 * For now at least, GameLobby just allows a player to join
 */
export function MatchLobby(props: MatchLobbyProps): JSX.Element {
    const { game, matchID } = props;

    return <JoinGame game={game} matchID={matchID} />;
}