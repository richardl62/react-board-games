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
  
  // illegal words when 'done' was pressed.
  const illegalWords = useRef<string[]>([]);

  // wwdp -> words when 'done' pressed
  const [wwdp, setWwdp] = useState<string[]>([]);

  if (candidtateWords === 'empty') {
    return <OuterDiv>
      <button onClick={moves.pass}> Pass </button>
    </OuterDiv>
  }

  const scoreMessage = 'Score this turn: ';

  if (candidtateWords === 'invalid') {
    return <OuterDiv> <div>{scoreMessage + '-'}</div> </OuterDiv>
  }

  const score = scoreWords(board, candidtateWords);
  const words = candidtateWords.map(cw => getWord(board, cw));

  const reportIllegalWords = sameJSON(words, wwdp) 
    && illegalWords.current.length > 0; 

  if (reportIllegalWords) {
    const onClick = () => {
        moves.finishTurn(score);
    }

    return (
      <div>
        <IllegalWords>
          Illegal Words:
          {illegalWords.current.map(w => <span key={w}>{w.toLowerCase()}</span>)}
        </IllegalWords>

        <OuterDiv>
          <div>{scoreMessage + score}</div>
          <button onClick={onClick}> Done (permit illegal words) </button>
        </OuterDiv>
      </div>
    )
  } else {
    const onClick = () => {
      setWwdp(words);
      illegalWords.current = words.filter(wd => !isLegalWord(wd));
      if(illegalWords.current.length === 0) {
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