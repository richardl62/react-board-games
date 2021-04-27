import { BoardProps as BgioBoardProps } from 'boardgame.io/react';
import React from "react";
import { BoardAndPlayers } from "..";
import { AppGame } from "../../shared/types";
import { GameControl, GameDefinition, useGameControlProps } from './control';
import { BoardStyle } from "./control/definition/game-definition";
import { onFunctions } from "./control/definition/on-functions";
import SimpleGame from './layout';
import { GridGameInput, makeBasicGridGame } from "./make-basic-grid-game";

interface AppFriendlyGameProps {
    gameDefinition: GameDefinition;
    bgioProps: BgioBoardProps;
}
function GameWrapper({bgioProps, gameDefinition} : AppFriendlyGameProps) {
    const gameControlProps = useGameControlProps(gameDefinition);
    const gameControl = new GameControl(bgioProps, gameControlProps);
        
    return (<SimpleGame gameControl={gameControl} />);
}

export function makeAppGridGame<GameSpecific = void>(
        input: GridGameInput<GameSpecific>,
        boardStyle: BoardStyle,
        renderPiece: (props: {pieceName: string}) => JSX.Element,
        ) : AppGame {

    const basicGame = makeBasicGridGame(input);

    const gameDefinition : GameDefinition = {
        ...basicGame,
        initialState: basicGame.setup(), //Hmm. Why is this needed?

        ...onFunctions(input),
        moveDescription: () => { return null; }, // Hmm. Can I get rid of this?

        boardStyle: boardStyle,
        offBoardPieces: input.offBoardPieces,
        renderPiece: renderPiece,
    };

    const board = (bgioProps: BgioBoardProps) => (
        <BoardAndPlayers {...bgioProps} >
            <GameWrapper bgioProps={bgioProps} gameDefinition={gameDefinition} />
        </BoardAndPlayers>);


    return {...basicGame, board: board,};
  }