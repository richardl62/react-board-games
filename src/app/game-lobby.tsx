import React from "react";
import { AppGame } from "../shared/types";
import { StartMatch } from "./start-match";

interface GameLobbyProps {
    game: AppGame;
}

export function GameLobby(props: GameLobbyProps) : JSX.Element {
    const { game } = props;
    
    return <StartMatch game={game} />;
}