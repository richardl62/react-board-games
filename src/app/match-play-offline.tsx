import React from "react";
import { BoardProps } from "../boardgame-lib/board-props";
import { AppGame } from "../app-game-support";
import { GameBoard } from "./game-board";
import { OfflineOptions } from "./offline-options";

import styled from "styled-components";
import { useOfflineBoardProps } from "../boardgame-lib/use-offline-board-props";

const OptionalDisplay = styled.div<{display_: boolean}>`
    display: ${props => props.display_? "block" : "none"};
`;

export function MatchPlayOffline(props: {
    game:AppGame,
    options: OfflineOptions,
}): JSX.Element {

    const { 
        game,
        options: {numPlayers, /*passAndPlay,*/  setupData}
    } = props;

    const boardProps : BoardProps = useOfflineBoardProps({game, numPlayers, setupData, id: 0});

    const passAndPlay = false; // TEMPORARY

    // Create a board that is optionally displayed. (Early code created either a board
    // or a blank element. However, this caused the Scrabble dictionary to be reloaded 
    // on each move. Presumably, this was because the compoment was unloaded and reloaded
    // each time.)
    const OptionalBoard = (obProps: BoardProps) => {
        const show = !passAndPlay || obProps.playerID === obProps.ctx.currentPlayer;
        return <OptionalDisplay display_={show}>
            <GameBoard game={game} bgioProps={obProps} />
        </OptionalDisplay>;
    };

    const games : JSX.Element[] = [];
    for(let id = 0; id < numPlayers; ++id) {
        games[id] = <OptionalBoard  key={id} {...boardProps} />; 
    }
    return (
        <div>{games}</div> 
    );
}


