import { useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { ClickDragState, DragType, SquareID, squareInteractionFunc } from "../../boards";
import { AppGame, Bgio } from "../../shared/types";
import { EndTurnActions } from "./EndTurnActionsProps";
import { onRack, playerNumber, tilesOut } from "./game-actions";
import { bgioMoves } from "./bgio-moves";
import { GameData, startingGameData } from "./game-data";
import { MainBoard } from "./main-board";
import { Rack } from "./rack";
import { WordChecker } from "./word-check";

const Game = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  `;

function Scrabble({G, moves}: Bgio.BoardProps<GameData>) {
  const {board} = G;

  const clickDragState = useRef(new ClickDragState()).current;

  const moveFunctions = {
    onMoveStart: (sq: SquareID) => {
      const canMove = onRack(sq) || Boolean(board[sq.row][sq.col]?.active)
      if(canMove) {
          moves.start(sq);
      }
      return canMove;
    },

    onMoveEnd: (from: SquareID, to: SquareID | null) => {
      moves.move(from, to);
    },

    dragType: () => DragType.move,
  }

  const squareInteraction = squareInteractionFunc(
    moveFunctions, clickDragState
  );

  const shuffle = moves.shuffleRack;
  const recall = tilesOut(G) && moves.recallRack;
  return (
    <DndProvider backend={HTML5Backend}>
      <Game>
        <Rack
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          letters={G.playerData[playerNumber].rack}
          shuffle={shuffle}
          recall={recall || undefined}
        />
        <MainBoard
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          board={G.board}
        />
        <WordChecker/>
        <EndTurnActions 
          board={G.board}
          endTurn={(score: number) => moves.finishTurn(score)}
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
