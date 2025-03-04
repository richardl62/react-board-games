import React from "react";
import { BoardProps as BgioBoardProps} from "../boardgame-lib/board-props";
import { AppGame } from "../app-game-support";
import { GameBoard } from "./game-board";
import { OfflineOptions } from "./offline-options";
import { SetupArg0 } from "../boardgame-lib/game";
import styled from "styled-components";
import { OfflineMatch } from "../boardgame-lib/offline-match";

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

    const passAndPlay = false; // TEMPORARY
    
    // Create a board that is optionally displayed. (Early code created either a board
    // or a blank element. However, this caused the Scrabble dictionary to be reloaded 
    // on each move. Presumably, this was because the compoment was unloaded and reloaded
    // each time.)
    const OptionalBoard = (obProps: BgioBoardProps) => {
        const show = !passAndPlay || obProps.playerID === obProps.ctx.currentPlayer;
        return <OptionalDisplay display_={show}>
            <GameBoard game={game} bgioProps={obProps} />
        </OptionalDisplay>;
    };

    const clientGame = {
        ...game,
        setup: (arg0: SetupArg0) => game.setup(arg0, setupData),
    };

    const games : JSX.Element[] = [];
    for(let id = 0; id < numPlayers; ++id) {
        games[id] = <OfflineMatch 
            key={id} 
            id={id}
            game={clientGame}
            board={OptionalBoard}
            numPlayers={numPlayers}
        />;
    }
    return (
        <div>{games}</div> 
    );
}


