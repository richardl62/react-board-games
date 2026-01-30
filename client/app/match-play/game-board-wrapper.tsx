import { JSX, useCallback, useEffect, useMemo } from "react";
import { AppGame } from "@/app-game-support";
import { ServerMatchData } from "@shared/server-match-data";
import { Ctx } from "@shared/game-control/ctx";
import { ConnectionStatus } from "./online/use-server-connection";
import { MatchStatus, UntypedMoves } from "@/app-game-support/board-props";
import { EventsAPI } from "@shared/game-control/events";
import { getPlayerStatus } from "@/app-game-support/player-status";

export type WaitingForServer = false | {actionIgnored: boolean};

interface Props {
    game: AppGame;

    playerID: string;
    connectionStatus: ConnectionStatus;
    
    serverMatchData: ServerMatchData;
    waitingForServer: WaitingForServer;
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
        return getPlayerStatus(serverMatchData.playerData, playerID).name
    }, [serverMatchData.playerData] );

    const matchStatus : MatchStatus = useMemo(() => {
        return {
            connectionStatus,
            playerData: serverMatchData.playerData,
            waitingForServer,
            errorInLastAction,
        };
    }, [connectionStatus, errorInLastAction, serverMatchData.playerData, waitingForServer]);

    const ctx = useMemo(() => {
        return new Ctx(serverMatchData.ctxData);
    },   [serverMatchData.ctxData]);

    const allJoined = useMemo(() => ctx.playOrder.every(
        (pid) => getPlayerStatus(serverMatchData.playerData, pid).connectionStatus !== "not joined"
    ), [ctx.playOrder, serverMatchData.playerData]);

    useEffect(() => {
        const status = allJoined ? `${getPlayerName(ctx.currentPlayer)} to play` : 'Game not started';
        const title = `${status} - ${game.displayName}`
        
        document.title = title;
    }, [allJoined, ctx.currentPlayer, game.displayName, getPlayerName]);

    const Board = game.board;
    return <Board
        G={serverMatchData.state}
        playerID={playerID}
        ctx={ctx}
        
        moves={moves}
        events={events}

        getPlayerName={getPlayerName}

        matchStatus={matchStatus}
        
        allJoined={allJoined}
     />;
}  