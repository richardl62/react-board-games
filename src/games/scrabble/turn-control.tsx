
import React, { ReactNode, useRef, useState } from "react";
import styled from "styled-components";
import assert from "../../shared/assert";
import { sameJSON } from "../../shared/tools";
import { BoardProps } from "../../shared/types";
import { ClientMoves } from "./bgio-moves";
import { rackSize, allLetterBonus } from "./board-properties";
import { findActiveLetters, findCandidateWords } from "./find-candidate-words";
import { getWord } from "./game-actions";
import { GameData } from "./game-data";
import { isLegalWord } from "./is-legal-word";
import { scoreWords } from "./score-word";

const StyledScoreLine = styled.div`
  display: flex; 
  font-size: large;
  * {
    margin-right: 0.5em;
  };
`;

const StyledIllegalWords = styled.div`
  display: inline-flex;
  gap: 0.5em;
  font-size: large;
  margin-bottom: 0.2em;
  font-weight: bold;
  color: darkred;
`;

interface IllegalWordsProps {
  illegalWords: string[];
}

function IllegalWord({ illegalWords }: IllegalWordsProps) {
  return (
    <StyledIllegalWords>
      Illegal Words:
      {illegalWords.map(w => <span key={w}>{w.toLowerCase()}</span>)}
    </StyledIllegalWords>
  )
}

interface ScoreLineProps {
  score: number | null;
  children?: ReactNode;
}
function ScoreLine({score, children} : ScoreLineProps) {
  return (
    <StyledScoreLine>
      <span>{'Score this turn: ' + (score ?? '-')}</span>
      {children}
    </StyledScoreLine>
  )
}

interface ScoreAndDoneProps {
  score: number;
  words: string[];
  onDone: () => void
}

function ScoreAndDone({score, words, onDone}: ScoreAndDoneProps) {
 // illegal words when 'done' was pressed.
 const illegalWords = useRef<string[]>([]);

 // wwdp -> words when 'done' pressed
 const [wwdp, setWwdp] = useState<string[]>([]);

 const reportIllegalWords = sameJSON(words, wwdp) 
   && illegalWords.current.length > 0; 

  const onUncheckedDone = () => {
    setWwdp(words);
    illegalWords.current = words.filter(wd => !isLegalWord(wd));
    if (illegalWords.current.length === 0) {
      onDone();
    }
  }

 const doneButton = reportIllegalWords?
    <button onClick={onDone}> Done (permit illegal words) </button> :
    <button onClick={onUncheckedDone}> done </button>

   return (
     <div>
       {reportIllegalWords && <IllegalWord illegalWords={illegalWords.current} />}

       <ScoreLine score={score} >
         {doneButton}
       </ScoreLine>
     </div>
   )
}

export function TurnControl(props: BoardProps<GameData>) {
  const board = props.G.board;
  const moves = props.moves as any as ClientMoves;
  const active = findActiveLetters(board)
  const isMyTurn = props.playerID === props.ctx.currentPlayer;

  if (active.length === 0) {
    const pass = () => {
      moves.endOfTurnActions();
      assert(props.events.endTurn);
      props.events.endTurn();
    }
    return (
      <StyledScoreLine>
        <button onClick={pass} disabled={!isMyTurn}> Pass </button>
      </StyledScoreLine>
    );
  }

  const candidtateWords = findCandidateWords(board, active);
  if (!candidtateWords) {
    return <ScoreLine score={null}/>
  }

  let score = scoreWords(board, candidtateWords);
  if(active.length === rackSize) {
    score += allLetterBonus;
  }
  
  const words = candidtateWords.map(cw => getWord(board, cw));
  const onDone = () => {
      moves.endOfTurnActions();
      moves.recordScore(score);
      assert(props.events.endTurn);
      props.events.endTurn();
  }
  
  return (
    <ScoreAndDone 
      score={score} 
      words={words}
      onDone={onDone}
    />
  );
}