
import React, { ReactNode, useRef, useState } from "react";
import styled from "styled-components";
import { sameJSON } from "../../shared/tools";
import { allLetterBonus } from "./scrabble-config";
import { findActiveLetters, findCandidateWords } from "./find-candidate-words";
import { getWord } from "./game-actions";
import { isLegalWord } from "./is-legal-word";
import { scoreWords } from "./score-word";
import { ScrabbleData } from "./scrabble-data";
import { sAssert } from "../../shared/assert";
import { LetterChooser } from "./letter-chooser";
import { Letter } from "./letters";

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
function ScoreLine({ score, children }: ScoreLineProps) {
  return (
    <StyledScoreLine>
      <span>{'Score this turn: ' + (score ?? '-')}</span>
      {children}
    </StyledScoreLine>
  )
}

interface ScoreAndDoneProps {
  scrabbleData: ScrabbleData;
  score: number | null;
  words: string[] | null;
}

function ScoreAndDone({ scrabbleData, score, words }: ScoreAndDoneProps) {
  // illegal words when 'done' was pressed.
  const illegalWords = useRef<string[]>([]);

  // wwdp -> words when 'done' pressed
  const [wwdp, setWwdp] = useState<string[]>([]);

  const reportIllegalWords = sameJSON(words, wwdp)
    && illegalWords.current.length > 0;

  const onDone = () => {
    sAssert(score);
    scrabbleData.endTurn(score);
  }
  const onUncheckedDone = () => {
    sAssert(words);

    setWwdp(words);
    illegalWords.current = words.filter(wd => !isLegalWord(wd));
    if (illegalWords.current.length === 0) {
      onDone();
    }
  }


  const DoneButton = () => {
    if (!scrabbleData.isMyTurn) {
      return null;
    }

    if (reportIllegalWords) {
      return <button onClick={onDone}> Done (permit illegal words) </button>;
    }

    if(score !== null) {
      return <button onClick={onUncheckedDone}> Done </button>
    }

    return null;
  }

  const unsetBlank = scrabbleData.getUnsetBlack();
  return (
    <div>
      {unsetBlank && <LetterChooser 
          recordChoosen={(l: Letter) => scrabbleData.setBlank(unsetBlank, l)}
      />}
      {reportIllegalWords && <IllegalWord illegalWords={illegalWords.current} />}

      <ScoreLine score={score} >
        {unsetBlank &&
          <DoneButton />
        }
      </ScoreLine>
    </div>
  )
}


export function TurnControl({ scrabbleData }: { scrabbleData: ScrabbleData }) {
  const active = findActiveLetters(scrabbleData.board);
  const config = scrabbleData.config;

  if (active.length === 0) {
    const pass = () => {
      scrabbleData.endTurn(0);
    }
    return (
      <StyledScoreLine>
        { scrabbleData.isMyTurn && <button onClick={pass}> Pass </button> }
      </StyledScoreLine>
    );
  }

  const candidtateWords = findCandidateWords(scrabbleData.board, active);
  let score = candidtateWords && scoreWords(scrabbleData.board, candidtateWords, config);
  if (score && active.length === config.rackSize) {
    score += allLetterBonus;
  }

  const words = candidtateWords && candidtateWords.map(cw => getWord(scrabbleData.board, cw));

  return (
    <ScoreAndDone
      score={score}
      words={words}
      scrabbleData={scrabbleData}
    />
  );
}