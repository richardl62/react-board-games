import styled from "styled-components";
import { Bgio } from "../../shared/types";
import { EndTurnConfirmation } from "./end-turn-confirmation";
import { findCandidateWords } from "./find-candidate-words";
import { getWord } from "./game-actions";
import { GameData } from "./game-data";
import { scoreWords } from "./score-word";

const ScoreAndControls = styled.div`
  display: flex; 
  font-size: large;
  * {
    margin-right: 1em;
  };

  margin-right: 0.6em;
`;

export function TurnControl({ G: { board }, moves }: Bgio.BoardProps<GameData>) {

    const cWords = findCandidateWords(board);
    const validTilePositions = cWords.length > 0;
    const words = cWords.map(cw => getWord(board, cw));
    const score = scoreWords(board, cWords);

    return (<ScoreAndControls>
        <div>{`Score this turn: ${score}`}</div>
        {validTilePositions &&
            <EndTurnConfirmation
                words={words}
                endTurn={() => moves.finishTurn(score)}
            />
        }
    </ScoreAndControls>)
}