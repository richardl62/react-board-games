import { JSX, useEffect } from "react";
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
    errorInLastAction: string | null;

    moves: UntypedMoves;
    events: EventsAPI;
}

export function GameBoard(props: GameBoardProps) : JSX.Element {

    // In theory, the code below could be memoized, but it seem harder than it's worth.
    const { game, serverMatchData, ...otherProps } = props;
    const ctx = new Ctx(serverMatchData.ctxData);

    const allJoined = ctx.playOrder.every(
        (pid) => makePlayerStatus(serverMatchData.playerData, pid).connectionStatus !== "not joined"
    );

    const gameProps : WrappedMatchProps = {
        ...otherProps,
        
        ctx,

        G: serverMatchData.state,

        getPlayerConnectionStatus: (playerID: string) => makePlayerStatus(
            serverMatchData.playerData,
            playerID
        ).connectionStatus,

        getPlayerName: (playerID: string) => makePlayerStatus(
            serverMatchData.playerData,
            playerID
        ).name,

        allJoined,
    };

    useEffect(() => {
        const status = gameStatus(gameProps);
        document.title = `${status} - ${game.displayName}`;
    });

    return game.board(gameProps);
}

