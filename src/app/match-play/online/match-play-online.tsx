import { JSX } from "react";
import { AppGame, MatchID, Player } from "@/app-game-support";

export function MatchPlayOnline(_props: {
    game: AppGame;
    matchID: MatchID;
    player: Player;
}): JSX.Element {
    return <div>Online Match: Not yet implemented</div>;
}
