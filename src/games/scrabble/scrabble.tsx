import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useErrorHandler } from "react-error-boundary";
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
  const handleError = useErrorHandler()

  const moveFunctions = {

    onMoveEnd: (from: SquareID, to: SquareID | null)=> {
      if (to) {
        try {
          scrabbleData.move({from: from, to: to});
        } catch(error) {
          handleError(error);
        }
      }
    },

    dragType: (sq: SquareID) => scrabbleData.canMove(sq) ? DragType.move : DragType.disable,
  }

  const squareInteraction = squareInteractionFunc(moveFunctions);

  if(!scrabbleData.allJoined) {
    <WaitingForPlayers {...scrabbleData.getProps()} />
  }

  const allowSwapping = scrabbleData.nTilesInBag >= scrabbleData.config.rackSize;
  const doSwapTiles = (toSwap: boolean[]) => {
    sAssert(allowSwapping);
    scrabbleData.swapTiles(toSwap);
    scrabbleData.endTurn(0);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Game>
        <ScoresEtc scrabbleData={scrabbleData} />
        <RackEtc
          squareInteraction={squareInteraction}
          rack={scrabbleData.rack}
          swapTiles={allowSwapping ? doSwapTiles : undefined}
          scrabbleData={scrabbleData}
        />
        <MainBoard
          squareInteraction={squareInteraction}
          board={scrabbleData.board}
          config={scrabbleData.config}
        />
        <SpaceBetween>
          <WordChecker/>
          <div>
            Tiles in bag: <span>{scrabbleData.nTilesInBag}</span>
          </div>
        </SpaceBetween>

        <TurnControl scrabbleData={scrabbleData}/>
      </Game>
    </DndProvider>
  )
}

