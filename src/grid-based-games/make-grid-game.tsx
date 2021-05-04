import { BoardProps as BgioBoardProps } from 'boardgame.io/react';
import React from "react";
import { BoardAndPlayers } from '../boards';
import { AppGame, BasicGame } from '../shared/types';
import { GameControl, GameDefinition, moves, useGameControlProps } from './control';
import { MoveControl, MoveResult } from "./control/definition";
import { BoardStyle, OnClick, OnDrag } from "./control/definition/game-definition";
import { onFunctions } from "./control/definition/on-functions";
import SimpleGame from './layout';
import { PiecePosition } from "./piece-position";

export type MoveFunction = (
  from: PiecePosition,
  to: PiecePosition  | null, // null -> moved off board
  moveControl: MoveControl, 
  ) => MoveResult;
  
export function makeSimpleName(displayName: string) {
    return displayName.toLowerCase().replace(/[^a-z0-9]/g,'');
  }
    
export interface GridGameState<GameSpecific = unknown> {
    pieces: Array<Array<string|null>>;
    selectedSquare: PiecePosition | null;
    legalMoves: Array<Array<boolean>> | null;
    gameSpecific?: GameSpecific;
}

export function makeGridGameState(pieces: Array<Array<string|null>>) : GridGameState {
  return {
    pieces: pieces,
    selectedSquare: null,
    legalMoves: null,
  }
}

export type StartingPieces = Array<Array<string|null>>;
export interface GridGameInput<GameSpecific = unknown> {
  displayName: string;

  setup: () => GridGameState<GameSpecific>,

  offBoardPieces: {
    top: Array<string>,
    bottom: Array<string>,
  },

  minPlayers: number,
  maxPlayers: number,

  // The 'on' options are:
  // - None of the three. This give default behaviour.
  // - onMove only. This gives customised move default, but other behaviour as defaults.
  //   (So all pieces are draggable, and default click-to-move default);
  // - onClick and OnDrag but not onMove.  This gives the full available control.
  // Kludge? With a bit of with it would be possible to build these rules into this type.
  onClick?: OnClick;
  onDrag?: OnDrag;
  onMove?: MoveFunction;
};

export function makeBasicGridGame<GameSpecific = void>(input: GridGameInput<GameSpecific>) 
  : BasicGame<GridGameState<GameSpecific>> {
    
    return {
      name: makeSimpleName(input.displayName),
      displayName: input.displayName,

      minPlayers: input.minPlayers,
      maxPlayers: input.maxPlayers,

      setup: input.setup,

      moves: moves,
    };
  }

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