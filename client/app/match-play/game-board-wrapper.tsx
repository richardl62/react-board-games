import { JSX, useCallback, useEffect, useMemo } from "react";
import { AppGame } from "@/app-game-support";
import { ServerMatchData } from "@shared/server-match-data";
import { Ctx } from "@shared/game-control/ctx";
import { ConnectionStatus } from "./online/use-server-connection";
import { UntypedMoves } from "@/app-game-support/board-props";
import { EventsAPI } from "@shared/game-control/events";
import { makePlayerStatus } from "@/app-game-support/player-status";

interface Props {
    game: AppGame;

    playerID: string;
    connectionStatus: ConnectionStatus;
    
    serverMatchData: ServerMatchData;
    waitingForServer: boolean;
    errorInLastAction: string | null;

    moves: UntypedMoves;
    events: EventsAPI;
}

// Renders the game board for a particular game. 
// It is the highest level at which the no distinction between online and offline matches is made. 
export function GameBoardWrapper(props: Props) : JSX.Element {
    const { game, serverMatchData, playerID, connectionStatus, 
        waitingForServer, errorInLastAction, moves, events } = props;
    
    const getPlayerName = useCallback((playerID: string) => {
        return makePlayerStatus(serverMatchData.playerData, playerID).name
    }, [serverMatchData.playerData] );

    const getPlayerConnectionStatus = useCallback((playerID: string) => {
        return makePlayerStatus(serverMatchData.playerData, playerID).connectionStatus
    }, [serverMatchData.playerData] );

    const ctx = useMemo(() => {
        return new Ctx(serverMatchData.ctxData);
    },   [serverMatchData.ctxData]);

    const allJoined = ctx.playOrder.every(
        (pid) => makePlayerStatus(serverMatchData.playerData, pid).connectionStatus !== "not joined"
    );

    const status = allJoined ? `${getPlayerName(ctx.currentPlayer)} to play` : 'Game not started';
    const title = `${status} - ${game.displayName}`
    useEffect(() => {
        document.title = title;
    }, [title]);

    const Board = game.board;
    return <Board
        ctx={ctx}
        allJoined={allJoined}
        G={serverMatchData.state}
        getPlayerConnectionStatus={getPlayerConnectionStatus}
        getPlayerName={getPlayerName}
        playerID={playerID}
        errorInLastAction={errorInLastAction}
        waitingForServer={waitingForServer}
        connectionStatus={connectionStatus}
        moves={moves}
        events={events}
     />;
}
