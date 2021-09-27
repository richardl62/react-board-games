import React, { useEffect } from "react";
import { Client, BoardProps as BgioBoardProps } from "boardgame.io/react";
import { SocketIO } from "boardgame.io/multiplayer";
import { MatchID, Player, AppGame } from "../shared/types";
import * as UrlParams from "./url-params";
import { makeBoardProps } from "../shared/board-props";

interface GamePlayOnlineProps {
  game: AppGame;
  matchID: MatchID;
  player: Player;
}

export function GamePlayOnline({ game, matchID, player }: GamePlayOnlineProps): JSX.Element {
    useEffect(() => {
        document.title = game.displayName;
    });

    const server = UrlParams.lobbyServer();

    const GameClient = Client({
        game: game,
        board: (props: BgioBoardProps) => game.board(makeBoardProps(props)),
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
