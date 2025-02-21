import React from "react";
import { Client } from "../boardgame-lib/client";
import { BoardProps as BgioBoardProps} from "../boardgame-lib/board-props";
import { Local } from "../boardgame-lib/client";
import { AppGame } from "../app-game-support";
import { GameBoard } from "./game-board";
import { OfflineOptions } from "./offline-options";
import { SetupArg0 } from "../boardgame-lib/game";
import styled from "styled-components";

const OptionalDisplay = styled.div<{display_: boolean}>`
    display: ${props => props.display_? "block" : "none"};
`;

export function MatchPlayOffline(props: {
    game:AppGame,
    options: OfflineOptions,
}): JSX.Element {

    const { 
        game,
        options: {numPlayers, passAndPlay, debugPanel, setupData}
    } = props;

    const wrappedSetup = (arg0: SetupArg0) => game.setup(arg0, setupData);
    
    const showBoard = (props: BgioBoardProps) =>
        !passAndPlay || props.playerID === props.ctx.currentPlayer;

    // Use of OptionalDisplay can improve efficiency.  Previously, board was
    // defined as 
    //   (props: BgioBoardProps) => showBoard(props) ?
    //      <GameBoard game={game} bgioProps={props} /> : 
    //    <></>
    // This lead to the Scrabble dictionary being reloaded each turn in
    // pass-and-play games. At a guess, this was due to GameClient being 
    // unmounted and remounted.  
    const GameClient = Client({
        game: {...game, setup: wrappedSetup},
        board: (props: BgioBoardProps) => 
            <OptionalDisplay display_={showBoard(props)}>
                <GameBoard game={game} bgioProps={props} />,
            </OptionalDisplay>,
        multiplayer: Local(),
        numPlayers,
        debug: debugPanel,
    });

    const games : JSX.Element[] = [];
    for(let id = 0; id < numPlayers; ++id) {
        games[id] = <GameClient key={id} playerID={id.toString()} />;
    }
    return (
        <div>{games}</div> 
    );
}


