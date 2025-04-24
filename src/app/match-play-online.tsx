import { JSX } from "react";
import { AppGame, MatchID, Player } from "../app-game-support";
import * as UrlParams from "./url-params";
import { OnlineMatch } from "../boardgame-lib/online-match";

export function MatchPlayOnline({ game, matchID, player }: {
    game: AppGame;
    matchID: MatchID;
    player: Player;
}): JSX.Element {
    const server = UrlParams.lobbyServer();

    return (
        <div>
            <OnlineMatch server={server} game={game} matchID={matchID.mid}
                playerID={player.id} credentials={player.credentials} />
        </div>
    );
}
