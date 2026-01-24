import { JSX, useEffect } from "react";
import { AppGame } from "@/app-game-support";
import { WrappedMatchProps } from "@/app-game-support/wrapped-match-props";
import { ServerMatchData } from "@shared/server-match-data";
import { Ctx } from "@shared/game-control/ctx";
import { ConnectionStatus } from "./online/use-server-connection";
import { UntypedMoves } from "@/app-game-support/wrapped-match-props";
import { EventsAPI } from "@shared/game-control/events";
import { makePlayerDataHACKED } from "@/app-game-support/player-data";

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

    useEffect(() => {
        const status = gameStatus(gameProps);
        document.title = `${status} - ${game.displayName}`;
    });

    useEffect(() => {
        console.log("Using makePlayerDataHACKED - temporary hack");
    }, []);


    // The code below code prbably be simplied.
    const { game, playerID, connectionStatus, serverMatchData, errorInLastAction, moves, events } = props;
    const ctx = new Ctx(serverMatchData.ctxData);
    const playerData = makePlayerDataHACKED(ctx, serverMatchData.playerData);
    const gameProps : WrappedMatchProps = {
        ctx, moves, events, playerID, connectionStatus, errorInLastAction,

        G: serverMatchData.state,

        playerData,

        // Convenience properties

        allJoined: Object.values(playerData).every(pd => pd.status !== "not joined"),
        
        getPlayerName: (playerID: string) => {
            const pd = playerData[playerID];
            return pd ? pd.name : "Unknown Player";
        }
    };

    return game.board(gameProps);
}

