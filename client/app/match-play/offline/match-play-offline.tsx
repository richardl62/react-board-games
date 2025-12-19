import { AppGame, BoardProps } from "@/app-game-support";
import { MoveArg0 } from "@shared/game-control/move-fn";
import { JSX, useState } from "react";
import styled from "styled-components";
import { OfflineOptions } from "../../offline-options";
import { GameBoard } from "../game-board";
import { useOfflineCtx } from "./use-offline-ctx";
import { useOfflineMatchData } from "./use-offline-match-data";
import { useRandomAPI } from "./use-random-api";
import { MoveResult, wrappedMoves } from "./wrapped-moves";
import { MatchDataElem } from "@/app-game-support/board-props";

const OptionalDisplay = styled.div<{display_: boolean}>`
    display: ${props => props.display_? "block" : "none"};
`;

function Board({game, show, matchData, moveArg0, moveError, setMoveResult}: {
    game: AppGame,
    show: boolean
    matchData: MatchDataElem[],
    moveArg0: MoveArg0<unknown>,
    moveError: string | null,
    setMoveResult: (arg: MoveResult) => void,
}): JSX.Element {
    throw new Error("This code needs to be updated after refactoring MatchDataElem");

    const boardProps: BoardProps = {
        ...moveArg0, // KLUDGE?

        // KLUDGE? Recomputed each render.
        moves: wrappedMoves(game, moveArg0, setMoveResult),
        
        matchData: matchData as unknown as BoardProps["matchData"],

        connectionStatus: "offline",

        moveError
    };

    return <OptionalDisplay display_={show}>
        {/* @ts-expect-error TODO(sligh): temporary until GameBoard offline refactor */}
        <GameBoard game={game} bgioProps={boardProps} />
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
    const matchData = useOfflineMatchData(ctx);

    const random = useRandomAPI();
    const [moveResult, setMoveResult] = useState<MoveResult>({
        G: game.setup({ ctx, random }, setupData),
        moveError: null,
    });

    const boards : JSX.Element[] = [];
    for(const playerID in ctx.playOrder ) {
        // Create a board that is optionally displayed. (Early code created either a board
        // or a blank element. However, this caused the Scrabble dictionary to be reloaded 
        // on each move. Presumably, this was because the compoment was unloaded and reloaded
        // each time.)
        const show = !passAndPlay || playerID === ctx.currentPlayer;

        const moveArg0: MoveArg0<unknown> = {
            playerID, ctx, events, G: moveResult.G, random,
        };

        boards.push(<Board 
            key={playerID} 
            show={show}
            game={game} 
            matchData={matchData}
            moveArg0={moveArg0} 
            moveError={moveResult.moveError}    
            setMoveResult={setMoveResult}
        />); 
    }

    return (
        <div>{boards}</div> 
    );
}


