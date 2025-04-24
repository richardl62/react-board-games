import { Client } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { AppGame, BoardProps } from "../app-game-support";
import { GameBoard } from "../app/game-board";

export function OnlineMatch({ server, game, matchID, playerID, credentials }: {
    server: string;
    game: AppGame;
    matchID: string;
    playerID: string;
    credentials: string;
}) {
    const multiplayer = SocketIO({ server });
    const debug = false;
    const board = (props: BoardProps) => <GameBoard game={game} bgioProps={props} />;
    const GameClient = Client({ game, board, multiplayer, debug });

    return <GameClient matchID={matchID} playerID={playerID} credentials={credentials} />;
}
