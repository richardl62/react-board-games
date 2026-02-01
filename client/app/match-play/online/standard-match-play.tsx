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
    const {moves, events, actionRequestStatus} = useOnlineMatchActions(game, player, serverConnection);
    const { connectionStatus, serverResponse} = serverConnection;
    const { debugMode } = useSearchParamData();

    return <div>
        {debugMode && <DebugModeActions serverConnection={serverConnection} />}
        <GameBoardWrapper
            game={game}
            playerID={player.id}
            connectionStatus={connectionStatus}
            actionRequestStatus={actionRequestStatus}
            serverMatchData={serverResponse.matchData}
            errorInLastAction={serverResponse.errorInLastAction}
            moves={moves}
            events={events}
        />
    </div>;
}
