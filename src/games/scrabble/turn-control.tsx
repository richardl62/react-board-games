import { useRef, useState } from "react";
import styled from "styled-components";
import { sameJSON } from "../../shared/tools";
import { Bgio } from "../../shared/types";
import { ClientMoves } from "./bgio-moves";
import { findCandidateWords } from "./find-candidate-words";
import { getWord } from "./game-actions";
import { GameData } from "./game-data";
import { isLegalWord } from "./is-legal-word";
import { scoreWords } from "./score-word";

const OuterDiv = styled.div`
  display: flex; 
  font-size: large;
  * {
    margin-right: 1em;
  };

  margin-right: 0.6em;
`;

const IllegalWords = styled.div`
  display: inline-flex;
  gap: 0.5em;
  font-size: large;
  margin-bottom: 0.2em;
  font-weight: bold;
  color: darkred;
`;

export function TurnControl(props: Bgio.BoardProps<GameData>) {
  const board = props.G.board;
  const moves = props.moves as any as ClientMoves;
  const candidtateWords = findCandidateWords(board);
  
  const [reportIllegalWords, setReportIllegalWords] = useState(false);

  let previousWordsRef = useRef<string[]>([]);


  if (candidtateWords === 'empty') {
    return <OuterDiv>
      <button onClick={moves.pass}> Pass </button>
    </OuterDiv>
  }

  const scoreMessage = 'score this turn: ';

  if (candidtateWords === 'invalid') {
    return <OuterDiv> <div>{scoreMessage + '-'}</div> </OuterDiv>
  }

  const score = scoreWords(board, candidtateWords);
  const words = candidtateWords.map(cw => getWord(board, cw));
  const illegalWords = words.filter(word => !isLegalWord(word));

  const previousWords = [...previousWordsRef.current];
  previousWordsRef.current = words;

  console.log("Rendering TurnControl", previousWords, words);
  if(!sameJSON(previousWords, words)) {
    console.log("candidate words have changed");
    setReportIllegalWords(false);
  }


  if (illegalWords.length > 0 && reportIllegalWords) {
    const onClick = () => {
        setReportIllegalWords(false);
        moves.finishTurn(score);
    }

    return (
      <div>
        <IllegalWords>
          Unrecognised Words:
          {illegalWords.map(w => <span key={w}>{w.toLowerCase()}</span>)}
        </IllegalWords>

        <OuterDiv>
          <div>{scoreMessage + score}</div>
          <button onClick={onClick}> Done (allow unrecongised words) </button>
        </OuterDiv>
      </div>
    )
  } else {
    const onClick = () => {
        if(illegalWords.length > 0) {
          setReportIllegalWords(true);
        } else {
          moves.finishTurn(score);
        }
    }
    return (
      <OuterDiv>
        <div>{scoreMessage + score}</div>
        <button onClick={onClick}> done </button>
      </OuterDiv>
    );
  }
}