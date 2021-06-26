import { useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { ClickDragState, makeSquareInteraction, MoveFunctions, SquareID } from "../../boards";
import { DragType } from "../../boards/internal/square";
import { nestedArrayMap } from "../../shared/tools";
import { AppGame, Bgio } from "../../shared/types";
import { MainBoard } from "./main-board";
import { Rack } from "./rack";
import { squareTypesArray } from "./square-type";

const StyledScrabble = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
`;

export type Letter = string;


type G = {
    board: (Letter|null)[][],
    racks: (Letter|null)[][],
    moveStart: SquareID | null,
}

function Scrabble(props: Bgio.BoardProps<G>) {
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
  
  const basicSquareInteraction = makeSquareInteraction(moveFunctions, clickDragState);
  const offBoardSquareInteraction = { ...basicSquareInteraction, dragType: () => DragType.copy };
  return (
    <DndProvider backend={HTML5Backend}>
      <StyledScrabble>
        <Rack
          squareInteraction={offBoardSquareInteraction}
          clickDragState={clickDragState}
          letters={G.racks[0] /*KLUDGE*/}
        />
        <MainBoard
          squareInteraction={offBoardSquareInteraction}
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
    setup: (): G => {
        return {
            board: nestedArrayMap(squareTypesArray, () => null), // KLUDGE?
            racks:[
                ['l', 'm', 'n', 'o', 'p'],
            ],
            moveStart: null,
        }
    },

    moves: {

    },

    board: Scrabble,
};
