import { BoardProps as BgioBoardProps, Client, SocketIO } from "../boardgame-lib/bgio";
import React from "react";
import { AppGame, MatchID, Player } from "../app-game-support";
import { GameBoard } from "./game-board";
import * as UrlParams from "./url-params";


interface MatchPlayOnlineProps {
  game: AppGame;
  matchID: MatchID;
  player: Player;
}

export function MatchPlayOnline({ game, matchID, player }: MatchPlayOnlineProps): JSX.Element {
    const server = UrlParams.lobbyServer();

    const GameClient = Client({
        game: game,
        board: (props: BgioBoardProps) => <GameBoard game={game} bgioProps={props} />,
        multiplayer: SocketIO({ server: server }),

        //numPlayers: matchOptions.nPlayers, - is this needed for multi-player and if so why?
        debug: UrlParams.bgioDebugPanel,
    });

    return (
        <div>
            <GameClient matchID={matchID.mid}
                playerID={player.id} credentials={player.credentials} />
        </div>
    );

}
