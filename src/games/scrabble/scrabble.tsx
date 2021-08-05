import React, { useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { ClickDragState, DragType, SquareID, squareInteractionFunc } from "../../boards";
import { WaitingForPlayers } from "../../game-support/waiting-for-players";
import { gAssert } from "../../shared/assert";
import { ClientMoves } from "./bgio-moves";
import { onRack } from "./game-actions";
import { MainBoard } from "./main-board";
import { RackEtc } from "./rack";
import { ScoresEtc } from "./scores-etc";
import { ScrabbleBoardProps } from "./scrabble-board-props";
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


export function ScrabbleBoard(props: ScrabbleBoardProps) {
  const {G, playerID, events, config } = props;
  gAssert(playerID);
  const moves = props.moves as any as ClientMoves;
  const {board} = G;

  const clickDragState = useRef(new ClickDragState()).current;
  
  const isMyTurn = props.playerID === props.ctx.currentPlayer;
  const canMove = (sq: SquareID) =>
    isMyTurn && (onRack(sq) || Boolean(board[sq.row][sq.col]?.active));

  const moveFunctions = {
    onClickMoveStart: (sq: SquareID) => {
      if(canMove(sq)) {
          moves.start(sq);
          return true;
      }
      return false;
    },

    onMoveEnd: (from: SquareID, to: SquareID | null) => {
      if (to) {
        moves.move({from: from, to: to});
      }
    },

    dragType: (sq: SquareID) => canMove(sq) ? DragType.move : DragType.disable,
  }

  const squareInteraction = squareInteractionFunc(
    moveFunctions, clickDragState
  );

  if(!props.allJoined) {
    return <WaitingForPlayers {...props} />
  }

  const rack = G.playerData[playerID].rack;
  const swapTiles = (toSwap: boolean[]) => {
    moves.swapTilesInRack(toSwap);
    gAssert(events.endTurn);
    events.endTurn();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Game>
        <ScoresEtc {...props} />
        <RackEtc
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          rack={rack}
          swapTiles={swapTiles}
          {...props}
        />
        <MainBoard
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          board={G.board}
          config={config}
        />
        <SpaceBetween>
          <WordChecker/>
          <div>
            Tiles left: <span>{G.bag.length}</span>
          </div>
        </SpaceBetween>

        <TurnControl {...props}/>

      </Game>
    </DndProvider>
  )
}

