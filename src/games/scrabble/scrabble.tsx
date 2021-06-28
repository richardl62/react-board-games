import { useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { ClickDragState, makeSquareInteraction } from "../../boards";
import { AppGame, Bgio } from "../../shared/types";
import { GameData, moveFunctions, moves, startingGameData } from "./game-actions";
import { MainBoard } from "./main-board";
import { Rack } from "./rack";

const StyledScrabble = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
`;

function Scrabble(props: Bgio.BoardProps<GameData>) {
  const clickDragState = useRef(new ClickDragState()).current;
  const squareInteraction = makeSquareInteraction(
    moveFunctions(props),
    clickDragState
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <StyledScrabble>
        <Rack
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          letters={props.G.racks[0] /*KLUDGE: should be for active player */}
        />
        <MainBoard
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          letters={props.G.board}
        />
      </StyledScrabble>
    </DndProvider>
  )
}

export const scrabble: AppGame = {

  name: 'scrabble',
  displayName: 'Scrabble',

  minPlayers: 1,
  maxPlayers: 1, //TEMPORARY

  setup: startingGameData,

  moves: moves,

  board: Scrabble,
};
