import { BoardProps as BgioBoardProps } from 'boardgame.io/react';
import React, { useState } from "react";
import { ActivePlayers } from '../game-support';
import { AppGame } from '../shared/types';
import { GameControl, GameDefinition, moves, useGameControlProps } from './control';
import { BoardStyle, OnClick, OnDrag } from "./control/definition/game-definition";
import { onFunctions } from "./control/definition/on-functions";
import SimpleGame from './layout';
import { makeSimpleName } from '../game-support/misc';
import { GridGameState, MoveFunction } from './types';

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

  boardStyle: BoardStyle,
  renderPiece: (props: { pieceName: string }) => JSX.Element,
};

interface AppFriendlyGameProps {
  gameDefinition: GameDefinition;
  bgioProps: BgioBoardProps;
}

function GameWrapper({ bgioProps, gameDefinition }: AppFriendlyGameProps) {
  const [ playersReady, setPlayersReady] = useState<boolean>(false);
  const gameControlProps = useGameControlProps(gameDefinition);
  const gameControl = new GameControl(bgioProps, gameControlProps);

  if(bgioProps.matchID) {
    return (
      <div>
        <ActivePlayers {...bgioProps} setPlayersReady={setPlayersReady} />
        {playersReady ? <SimpleGame gameControl={gameControl} /> : null}
      </div>
    );
  } else {
    //KLUDGE? Assume this is a local game with no player information to display
    return <SimpleGame gameControl={gameControl} />
  }
}

export function makeGridGame<GameSpecific = void>(
  input: GridGameInput<GameSpecific>,
): AppGame {

  const gameDefinition = {
    ...input,
    name: makeSimpleName(input.displayName),
    moves: moves,

    ...onFunctions(input),

    moveDescription: () => { return null; }, // Hmm. Can I get rid of this?
    initialState: input.setup(), //Hmm. Why is this needed?
  };

  const board = (bgioProps: BgioBoardProps) =>
    <GameWrapper bgioProps={bgioProps} gameDefinition={gameDefinition} />

  return {
    ...gameDefinition,
    board: board,
  }
}