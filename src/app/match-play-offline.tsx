import { JSX } from "react";
import { AppGame } from "../app-game-support";
import { GameBoard } from "./game-board";
import { OfflineOptions } from "./offline-options";

import styled from "styled-components";
import { useSharedOfflineBoardData, offlineBoardProps } from "../boardgame-lib/offline-board-props";

const OptionalDisplay = styled.div<{display_: boolean}>`
    display: ${props => props.display_? "block" : "none"};
`;

type SharedData = ReturnType<typeof useSharedOfflineBoardData>;

function Board({game, sharedData, id, show}: {
    game: AppGame,
    sharedData: SharedData,
    id: number,
    show: boolean,
}): JSX.Element {
    const boardProps = offlineBoardProps(game, sharedData, id);

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

    const sharedData = useSharedOfflineBoardData({game, numPlayers, setupData});

    const games : JSX.Element[] = [];
    for(let id = 0; id < numPlayers; ++id) {
        // Create a board that is optionally displayed. (Early code created either a board
        // or a blank element. However, this caused the Scrabble dictionary to be reloaded 
        // on each move. Presumably, this was because the compoment was unloaded and reloaded
        // each time.)
        const show = !passAndPlay || id.toString() === sharedData.ctx.currentPlayer;

        games.push(<Board key={id} game={game} sharedData={sharedData} id={id} show={show} />); 
    }

    return (
        <div>{games}</div> 
    );
}


