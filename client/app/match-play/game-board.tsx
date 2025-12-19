import { JSX, useEffect } from "react";
import { AppGame, BoardProps, ConnectionStatus } from "@/app-game-support";
import { RequiredServerData } from "@game-control/required-server-data";
import { WrappedGameProps, useWrappedGameProps } from "@/app-game-support/wrapped-game-props";
import { ServerMatchData } from "@shared/server-match-data";
import { Ctx } from "@shared/game-control/ctx";
import { PublicPlayerMetadata } from "@shared/lobby/types";
import { MatchDataElem } from "@/app-game-support/board-props";

function gameStatus(gameProps: WrappedGameProps) {
    if(!gameProps.allJoined) {
        return "Game not started";
    } else {
        const player = gameProps.getPlayerName(gameProps.ctx.currentPlayer);
        return `${player} to play`;
    }
}

function convertPlayerData(md: PublicPlayerMetadata) : MatchDataElem {
    const {id, name, isConnected} = md;
    return {id, isConnected, name: name || undefined}
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

    const bgioProps: BoardProps<RequiredServerData> = {
        playerID,

        connectionStatus,

        ctx: new Ctx(serverMatchData.ctxData),

        // The need for the conversion shows something isn't quite right.
        matchData: serverMatchData.playerData.map(convertPlayerData),

        moves,
        
        events,

        G: serverMatchData.state,

        moveError: serverMatchData.moveError,
    }

    // The need for this conversion also shows something isn't quite right. 
    const gameProps = useWrappedGameProps(bgioProps);

    useEffect(() => {
        const status = gameStatus(gameProps);
        document.title = `${status} - ${game.displayName}`;
    });

    return game.board(gameProps);
}

