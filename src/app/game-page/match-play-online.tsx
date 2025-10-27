import { serverAddress } from "@shared/server-address";
import { JSX } from "react";
import { AppGame, MatchID, Player } from "../../app-game-support";
import { OnlineMatch } from "../../boardgame-lib/online-match";

export function MatchPlayOnline({ game, matchID, player }: {
    game: AppGame;
    matchID: MatchID;
    player: Player;
}): JSX.Element {
    const server = serverAddress();

    return (
        <div>
            <OnlineMatch server={server} game={game} matchID={matchID.mid}
                playerID={player.id} credentials={player.credentials} />
        </div>
    );
}
