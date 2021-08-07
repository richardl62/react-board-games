import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { DragType, SquareID, squareInteractionFunc } from "../../boards";
import { WaitingForPlayers } from "../../game-support/waiting-for-players";
import { sAssert } from "../../shared/assert";
import { MainBoard } from "./main-board";
import { RackEtc } from "./rack";
import { ScoresEtc } from "./scores-etc";
import { ScrabbleBoardProps } from "./scrabble-board-props";
import { useScrabbleData } from "./scrabble-data";
import { TurnControl } from "./turn-control";
import { WordChecker } from "./word-check";

const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between
`;
const Game = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  `;

  
export function ScrabbleBoard(props_: ScrabbleBoardProps) {
  const scrabbleData = useScrabbleData(props_);


  const moveFunctions = {
    onClickMoveStart: (sq: SquareID) => {
      if(scrabbleData.canMove(sq)) {
          scrabbleData.moves.start(sq);
          return true;
      }
      return false;
    },

    onMoveEnd: (from: SquareID, to: SquareID | null) => {
      if (to) {
        scrabbleData.moves.move({from: from, to: to});
      }
    },

    dragType: (sq: SquareID) => scrabbleData.canMove(sq) ? DragType.move : DragType.disable,
  }

  const squareInteraction = squareInteractionFunc(
    moveFunctions, scrabbleData.clickDragState
  );

  if(!scrabbleData.allJoined) {
    <WaitingForPlayers scrabbleData={scrabbleData} />
  }

  const rack = scrabbleData.rackEtc[scrabbleData.playerID].rack;
  const swapTiles = (toSwap: boolean[]) => {
    scrabbleData.moves.swapTilesInRack(toSwap);
    sAssert(scrabbleData.events.endTurn);
    scrabbleData.events.endTurn();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Game>
        <ScoresEtc scrabbleData={scrabbleData} />
        <RackEtc
          squareInteraction={squareInteraction}
          clickDragState={scrabbleData.clickDragState}
          rack={rack}
          swapTiles={swapTiles}
          //Hmm, why this as well as the above?
          scrabbleData={scrabbleData}
        />
        <MainBoard
          squareInteraction={squareInteraction}
          clickDragState={scrabbleData.clickDragState}
          board={scrabbleData.board}
          config={scrabbleData.config}
        />
        <SpaceBetween>
          <WordChecker/>
          <div>
            Tiles left: <span>{G.bag.length}</span>
          </div>
        </SpaceBetween>

        <TurnControl scrabbleData={scrabbleData}/>

      </Game>
    </DndProvider>
  )
}

