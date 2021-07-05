import { useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { ClickDragState, squareInteractionFunc } from "../../boards";
import { AppGame, Bgio } from "../../shared/types";
import { BelowBoard } from "./below-board";
import { moveFunctions, bgioMoves } from "./game-actions";
import { GameData, startingGameData } from "./game-data";
import { MainBoard } from "./main-board";
import { Rack } from "./rack";

const Game = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  `;

function tilesOut(gameData: GameData) : boolean {
  return !!gameData.board.find(row => row.find(sq=>sq?.active));
}
function Scrabble(props: Bgio.BoardProps<GameData>) {
  const clickDragState = useRef(new ClickDragState()).current;
  const squareInteraction = squareInteractionFunc(
    moveFunctions(props),
    clickDragState
  );

  const shuffle = props.moves.shuffleRack;
  const recall = tilesOut(props.G) && props.moves.recallRack;
  return (
    <DndProvider backend={HTML5Backend}>
      <Game>
        <Rack
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          letters={props.G.racks[0] /*KLUDGE: should be for active player */}
          shuffle={shuffle}
          recall={recall || undefined}
        />
        <MainBoard
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          board={props.G.board}
        />
        <BelowBoard 
          score={props.G.scoreThisTurn}
          done={() => props.moves.finishTurn()}
        />
      </Game>
    </DndProvider>
  )
}

export const scrabble: AppGame = {

  name: 'scrabble',
  displayName: 'Scrabble',

  minPlayers: 1,
  maxPlayers: 1, //TEMPORARY

  setup: startingGameData,

  moves: bgioMoves,

  board: Scrabble,
};
