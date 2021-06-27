import { useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { ClickDragState, makeSquareInteraction, MoveFunctions, SquareID } from "../../boards";
import { AppGame, Bgio } from "../../shared/types";
import { GameData, moves, startingGameData } from "./game-actions";
import { MainBoard } from "./main-board";
import { Rack } from "./rack";

const StyledScrabble = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
`;

function Scrabble(props: Bgio.BoardProps<GameData>) {
    const { G } = props;
  
    const clickDragState = useRef(new ClickDragState()).current;
    const moveFunctions: MoveFunctions = {
      onClick: (sq: SquareID) => {
        console.log('onClick', JSON.stringify(sq));
      },
  
      onMoveStart: (sq: SquareID) => {
        console.log('onMoveStart', JSON.stringify(sq));
        return true;
      },
  
      onMoveEnd: (sq: SquareID) => {
        console.log('onMoveEnd', JSON.stringify(sq));
      }
    };
  
  const squareInteraction = makeSquareInteraction(moveFunctions, clickDragState);
  return (
    <DndProvider backend={HTML5Backend}>
      <StyledScrabble>
        <Rack
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          letters={G.racks[0] /*KLUDGE*/}
        />
        <MainBoard
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          letters={G.board}
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
