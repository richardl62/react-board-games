import { JSX, useEffect, useMemo } from "react";
import { AppGame } from "@/app-game-support";
import { WrappedMatchProps } from "@/app-game-support/wrapped-match-props";
import { ServerMatchData } from "@shared/server-match-data";
import { Ctx } from "@shared/game-control/ctx";
import { ConnectionStatus } from "./online/use-server-connection";
import { UntypedMoves } from "@/app-game-support/wrapped-match-props";
import { EventsAPI } from "@shared/game-control/events";
import { makePlayerStatus } from "@/app-game-support/player-status";

function gameStatus(gameProps: WrappedMatchProps) {
    if (!gameProps.allJoined) {
        return "Game not started";
    } else {
        const player = gameProps.getPlayerName(gameProps.ctx.currentPlayer);
        return `${player} to play`;
    }
}

export interface GameBoardProps {
    game: AppGame;

    playerID: string;
    connectionStatus: ConnectionStatus;
    
    serverMatchData: ServerMatchData;
    waitingForServer: boolean;
    errorInLastAction: string | null;

    moves: UntypedMoves;
    events: EventsAPI;
}

export function GameBoard(props: GameBoardProps) : JSX.Element {
    const { game, serverMatchData, playerID, connectionStatus, 
        waitingForServer, errorInLastAction, moves, events } = props;

    const gameProps: WrappedMatchProps = useMemo(() => {
        const ctx = new Ctx(serverMatchData.ctxData);
        const allJoined = ctx.playOrder.every(
            (pid) => makePlayerStatus(serverMatchData.playerData, pid).connectionStatus !== "not joined"
        );

        return {
            playerID,
            connectionStatus,
            waitingForServer,
            errorInLastAction,
            moves,
            events,
            ctx,
            G: serverMatchData.state,
            getPlayerConnectionStatus: (playerID: string) => 
                makePlayerStatus(serverMatchData.playerData, playerID).connectionStatus,
            getPlayerName: (playerID: string) => 
                makePlayerStatus(serverMatchData.playerData, playerID).name,
            allJoined,
        };
    }, [serverMatchData, playerID, connectionStatus, waitingForServer, errorInLastAction, moves, events]);

    const title = `${gameStatus(gameProps)} - ${game.displayName}`;
    useEffect(() => {
        document.title = title;
    }, [title]);

    const Board = game.board;
    return <Board {...gameProps} />;
}
