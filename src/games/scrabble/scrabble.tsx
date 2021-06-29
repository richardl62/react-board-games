import { ReactElement } from "react";
import { useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { ClickDragState, makeSquareInteraction } from "../../boards";
import { AppGame, Bgio } from "../../shared/types";
import { moveFunctions, moves } from "./game-actions";
import { GameData, startingGameData } from "./game-data";
import { GameInteractions } from "./game-interactions";
import { MainBoard } from "./main-board";
import { Rack } from "./rack";


function BoardAndRack({ children }: { children: ReactElement[] }) {
  //Hmm. There must be a better way.
  const Inner = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
  `;

  return (<div>
    <Inner>
      {children}
    </Inner>
  </div>);
}

function Scrabble(props: Bgio.BoardProps<GameData>) {
  const clickDragState = useRef(new ClickDragState()).current;
  const squareInteraction = makeSquareInteraction(
    moveFunctions(props),
    clickDragState
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardAndRack>
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
      </BoardAndRack>
      <GameInteractions {...props} />
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
