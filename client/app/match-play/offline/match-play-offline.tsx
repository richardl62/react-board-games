import { AppGame, BoardProps } from "@/app-game-support";
import { MoveArg0 } from "@shared/game-control/move-fn";
import { RequiredServerData } from "@shared/game-control/required-server-data";
import { JSX, useState } from "react";
import styled from "styled-components";
import { OfflineOptions } from "../../offline-options";
import { GameBoard } from "../game-board";
import { useOfflineCtx } from "./use-offline-ctx";
import { useOfflineMatchData } from "./use-offline-match-data";
import { useRandomAPI } from "./use-random-api";
import { wrappedMoves } from "./wrapped-moves";
import { MatchDataElem } from "@/app-game-support/board-props";

const OptionalDisplay = styled.div<{display_: boolean}>`
    display: ${props => props.display_? "block" : "none"};
`;

function Board({game, show, matchData, moveArg0, setG}: {
    game: AppGame,
    show: boolean
    matchData: MatchDataElem[],
    moveArg0: MoveArg0<unknown>,
    setG: (arg: RequiredServerData) => void,
}): JSX.Element {

    const boardProps: BoardProps = {
        ...moveArg0, // KLUDGE?

        // KLUDGE? Recomputed each render.
        moves: wrappedMoves(game, moveArg0, setG),
        
        matchData,

        connectionStatus: "offline",
    };

    return <OptionalDisplay display_={show}>
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

    const { ctx,  events } = useOfflineCtx(numPlayers);
    const matchData = useOfflineMatchData(ctx);

    const random = useRandomAPI();
    const [G, setG] = useState(
        game.setup({ ctx, random }, setupData)
    );

    const boards : JSX.Element[] = [];
    for(const playerID in ctx.playOrder ) {
        // Create a board that is optionally displayed. (Early code created either a board
        // or a blank element. However, this caused the Scrabble dictionary to be reloaded 
        // on each move. Presumably, this was because the compoment was unloaded and reloaded
        // each time.)
        const show = !passAndPlay || playerID === ctx.currentPlayer;

        const moveArg0: MoveArg0<unknown> = {
            playerID, ctx, events, G, random,
        };

        boards.push(<Board 
            key={playerID} 
            show={show}
            game={game} 
            matchData={matchData}
            moveArg0={moveArg0} 
            setG={setG}
        />); 
    }

    return (
        <div>{boards}</div> 
    );
}


