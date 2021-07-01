import { ReactElement } from "react";
import { useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { ClickDragState, makeSquareInteraction } from "../../boards";
import { AppGame, Bgio } from "../../shared/types";
import { moveFunctions, bgioMoves } from "./game-actions";
import { GameData, startingGameData } from "./game-data";
import { MainBoard } from "./main-board";
import { Rack } from "./rack";

const InnerBoardAndRack = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  `;

const DoneButton = styled.button`
  font-size: large;
`

function BoardAndRack({ children }: { children: ReactElement[] }) {
  //Hmm. There must be a better way.
  return (<div>
    <InnerBoardAndRack>
      {children}
    </InnerBoardAndRack>
  </div>);
}

function tilesOut(gameData: GameData) : boolean {
  return !!gameData.board.find(row => row.find(sq=>sq?.active));
}
function Scrabble(props: Bgio.BoardProps<GameData>) {
  const clickDragState = useRef(new ClickDragState()).current;
  const squareInteraction = makeSquareInteraction(
    moveFunctions(props),
    clickDragState
  );

  const shuffle = props.moves.shuffleRack;
  const recall = tilesOut(props.G) && props.moves.recallRack;
  return (
    <DndProvider backend={HTML5Backend}>
      <BoardAndRack>
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
        <DoneButton onClick={() => props.moves.finishTurn()}>Done</DoneButton>
      </BoardAndRack>
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
