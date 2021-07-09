import { findCandidateWords } from "./find-candidate-words";
import { getWord } from "./game-actions";
import { BoardData } from "./game-data";
import { scoreWords } from "./score-word";
import { Message, EndTurnConfirmation } from "./end-turn-confirmation";

interface EndTurnActionsProps {
  board: BoardData;
  endTurn: (score: number) => void;
}

export function EndTurnActions({ board, endTurn }: EndTurnActionsProps) {
  const cwords = findCandidateWords(board);

  if (!cwords) {
    return <Message>Place tiles in valid positions</Message>;
  }

  const score = scoreWords(board, cwords);
  const words = cwords.map(cw => getWord(board, cw));

  return (
    <>
      <div>
        <Message>Score: <span> {score}</span></Message>
        <EndTurnConfirmation
          words={words}
          endTurn={() => endTurn(score)} />
      </div>
    </>
  );
}
