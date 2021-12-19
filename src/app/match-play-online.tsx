import React, { useEffect } from "react";
import { Client, BoardProps as BgioBoardProps } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { MatchID, Player, AppGame } from "../shared/types";
import * as UrlParams from "./url-params";
import { makeWrappedGameProps } from "../bgio";

interface GamePlayOnlineProps {
  game: AppGame;
  matchID: MatchID;
  player: Player;
}

export function MatchPlayOnline({ game, matchID, player }: GamePlayOnlineProps): JSX.Element {
    useEffect(() => {
        document.title = game.displayName;
    });

    const server = UrlParams.lobbyServer();

    const GameClient = Client({
        game: game,
        board: (props: BgioBoardProps) => game.board(makeWrappedGameProps(props)),
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
