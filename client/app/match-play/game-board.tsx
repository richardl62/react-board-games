import { JSX, useEffect } from "react";
import { AppGame } from "@/app-game-support";
import { WrappedMatchProps, useWrappedMatchProps } from "@/app-game-support/wrapped-match-props";
import { ServerMatchData } from "@shared/server-match-data";
import { Ctx } from "@shared/game-control/ctx";
import { ConnectionStatus } from "./online/use-server-connection";
import { UntypedMoves } from "@/app-game-support/board-props";
import { EventsAPI } from "@shared/game-control/events";

function gameStatus(gameProps: WrappedMatchProps) {
    if(!gameProps.allJoined) {
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
    const { game, playerID, connectionStatus, serverMatchData, errorInLastAction, moves, events } = props;

    // The need for this conversion shows something isn't quite right. 
    const gameProps = useWrappedMatchProps({
        playerID,

        connectionStatus,

        ctx: new Ctx(serverMatchData.ctxData),

        matchData: serverMatchData.playerData,

        moves,

        events,

        G: serverMatchData.state,

        errorInLastAction,
    });

    useEffect(() => {
        const status = gameStatus(gameProps);
        document.title = `${status} - ${game.displayName}`;
    });

    return game.board(gameProps);
}

