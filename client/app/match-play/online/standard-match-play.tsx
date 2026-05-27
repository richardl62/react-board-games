import { AppGame, Player } from "@/app-game-support";
import { JSX } from "react";
import { GameBoardWrapper } from "../game-board-wrapper";
import { useOnlineMatchActions } from "./use-online-match-actions";
import { ServerConnection} from "./use-server-connection";
import { DebugModeActions } from "./debug-mode-actions";
import { useSearchParamData } from "@/url-tools";

interface ServerConnectionWithResponse extends ServerConnection {
    serverResponse: NonNullable<ServerConnection["serverResponse"]>;
}

interface StandardMatchPlayProps {
    game: AppGame;
    player: Player;
    serverConnection: ServerConnectionWithResponse;
}

export function StandardMatchPlay({ game, player, serverConnection }: StandardMatchPlayProps): JSX.Element {
    const { connectionStatus, serverResponse } = serverConnection;
    const { moves, events, actionRequestStatus, optimisticMatchData } =
        useOnlineMatchActions(game, player, serverConnection, serverResponse.matchData);
    const { debugMode } = useSearchParamData();

    const displayedMatchData = optimisticMatchData ?? serverResponse.matchData;
    const displayedError = optimisticMatchData !== null ? null : serverResponse.errorInLastAction;

    return <div>
        {debugMode && <DebugModeActions serverConnection={serverConnection} />}
        <GameBoardWrapper
            game={game}
            playerID={player.id}
            connectionStatus={connectionStatus}
            actionRequestStatus={actionRequestStatus}
            serverMatchData={displayedMatchData}
            errorInLastAction={displayedError}
            moves={moves}
            events={events}
        />
    </div>;
}
