import React, { useEffect } from "react";
import { Client, BoardProps as BgioBoardProps } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { MatchID, Player, AppGame } from "../shared/types";
import * as UrlParams from "./url-params";
import { GameBoard } from "../bgio";

interface MatchPlayOnlineProps {
  game: AppGame;
  matchID: MatchID;
  player: Player;
}

export function MatchPlayOnline({ game, matchID, player }: MatchPlayOnlineProps): JSX.Element {
    useEffect(() => {
        document.title = game.displayName;
    });

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
