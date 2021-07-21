import { useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";
import { ClickDragState, DragType, SquareID, squareInteractionFunc } from "../../boards";
import { AppGame, Bgio } from "../../shared/types";
import { bgioMoves, ClientMoves } from "./bgio-moves";
import { EndTurnConfirmation } from "./end-turn-confirmation";
import { findCandidateWords } from "./find-candidate-words";
import { getWord, onRack } from "./game-actions";
import { GameData, startingGameData } from "./game-data";
import { MainBoard } from "./main-board";
import { Rack } from "./rack";
import { scoreWords } from "./score-word";
import { Scores } from "./scores";
import { WordChecker } from "./word-check";

const Game = styled.div`
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  `;

const ScoreAndBagSize = styled.div`
  display: flex;
  justify-content: space-between;  
  font-size: large;
  font-weight: bold;
  margin-right: 0.5em;

  color: red;
`;;

function Scrabble(props: Bgio.BoardProps<GameData>) {
  const {G } = props;
  const moves = props.moves as any as ClientMoves;
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
      if (to) {
        moves.move(from, to);
      }
    },

    dragType: () => DragType.move,
  }

  const squareInteraction = squareInteractionFunc(
    moveFunctions, clickDragState
  );

  const cWords = findCandidateWords(board);
  const validTilePositions = cWords.length > 0;
  const words = cWords.map(cw => getWord(board, cw));
  const score = scoreWords(board, cWords);

  return (
    <DndProvider backend={HTML5Backend}>
      <Game>
        <Scores G={G} />
        <Rack
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          {...props}
        />
        <MainBoard
          squareInteraction={squareInteraction}
          clickDragState={clickDragState}
          board={G.board}
        />
        <WordChecker/>
        <ScoreAndBagSize>
          <div>
            Score: <span> {validTilePositions ? score : '-'}</span>
          </div>
          <div>
            Tiles in bag: <span>{G.bag.length}</span>
          </div>
        </ScoreAndBagSize>
        {validTilePositions && 
            <EndTurnConfirmation 
              words={words}
              endTurn={() => moves.finishTurn(score)}
            />
        }
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
