import { AppGame } from "@/app-game-support";
import { MoveArg0 } from "@shared/game-control/move-fn";
import { JSX, useState } from "react";
import styled from "styled-components";
import { OfflineOptions } from "../../offline-options";
import { GameBoard } from "../game-board";
import { useOfflineCtx } from "./use-offline-ctx";
import { useOfflineMatchData } from "./use-offline-match-data";
import { useRandomAPI } from "./use-random-api";
import { MoveResult, wrappedMoves } from "./wrapped-moves";
import { ServerMatchData } from "@shared/server-match-data";
import { RequiredServerData } from "@shared/game-control/required-server-data";
import { PublicPlayerMetadata } from "@shared/lobby/types";

const OptionalDisplay = styled.div<{display_: boolean}>`
    display: ${props => props.display_? "block" : "none"};
`;

function Board({game, show, playerData, moveArg0, moveError, setMoveResult}: {
    game: AppGame,
    show: boolean
    playerData: PublicPlayerMetadata[],
    moveArg0: MoveArg0<RequiredServerData>,
    moveError: string | null,
    setMoveResult: (arg: MoveResult) => void,
}): JSX.Element {
    const moves = wrappedMoves(game, moveArg0, setMoveResult);

    const serverMatchData: ServerMatchData = {
        playerData,
        ctxData: moveArg0.ctx.data,
        state: moveArg0.G,
        moveError,
    };

    return <OptionalDisplay display_={show}>
        <GameBoard 
            game={game}
            playerID={moveArg0.playerID}
            connectionStatus={"offline"}
            serverMatchData={serverMatchData}
            moves={moves}
            events={moveArg0.events}
        />
    </OptionalDisplay>;
}

export function MatchPlayOffline(props: {
    game:AppGame,
    options: OfflineOptions,
}): JSX.Element {

    const { 
        game,
        options: {numPlayers, passAndPlay,  setupData}
    } = props;

    // This is all rather messy. Can it be improved?
    const { ctx,  events } = useOfflineCtx(numPlayers);
    const playerData = useOfflineMatchData(ctx);

    const random = useRandomAPI();

    const [moveResult, setMoveResult] = useState<MoveResult>({
        G: game.setup({ ctx, random }, setupData),
        moveError: null,
    });

    const boards : JSX.Element[] = [];
    for (const playerID of ctx.playOrder) {
        // Create a board that is optionally displayed. (Early code created either a board
        // or a blank element. However, this caused the Scrabble dictionary to be reloaded 
        // on each move. Presumably, this was because the compoment was unloaded and reloaded
        // each time.)
        const show = !passAndPlay || playerID === ctx.currentPlayer;

        const moveArg0: MoveArg0<RequiredServerData> = {
            playerID, ctx, events, G: moveResult.G, random,
        };

        boards.push(<Board 
            key={playerID} 
            show={show}
            game={game} 
            playerData={playerData}
            moveArg0={moveArg0} 
            moveError={moveResult.moveError}    
            setMoveResult={setMoveResult}
        />); 
    }

    return (
        <div>{boards}</div> 
    );
}


