import { JSX, useEffect } from "react";
import { AppGame, BoardProps } from "@/app-game-support";
import { WrappedMatchProps, useWrappedMatchProps } from "@/app-game-support/wrapped-match-props";
import { ServerMatchData } from "@shared/server-match-data";
import { Ctx } from "@shared/game-control/ctx";
import { ConnectionStatus } from "./online/use-server-connection";

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
    moves: BoardProps["moves"];
    events: BoardProps["events"];
}

export function GameBoard(props: GameBoardProps) : JSX.Element {
    const { game, playerID, connectionStatus, serverMatchData,  moves, events } = props;

    const bgioProps: BoardProps = {
        playerID,

        connectionStatus,

        ctx: new Ctx(serverMatchData.ctxData),

        matchData: serverMatchData.playerData,

        moves,
        
        events,

        G: serverMatchData.state,

        moveError: serverMatchData.moveError,
    }

    // The need for this conversion shows something isn't quite right. 
    const gameProps = useWrappedMatchProps(bgioProps);

    useEffect(() => {
        const status = gameStatus(gameProps);
        document.title = `${status} - ${game.displayName}`;
    });

    return game.board(gameProps);
}

