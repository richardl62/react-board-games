import { useState } from "react";
import styled from "styled-components";
import { Bgio } from "../../shared/types";
import { ClientMoves } from "./bgio-moves";
import { EndTurnConfirmation } from "./end-turn-confirmation";
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

export function TurnControl(props: Bgio.BoardProps<GameData>) {
  const board = props.G.board;
  const moves = props.moves as any as ClientMoves;
  const candidtateWords = findCandidateWords(board);

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

  return (
    <OuterDiv>
      <div>{scoreMessage + score}</div>
      <button onClick={() => moves.finishTurn(score)}> done </button>
    </OuterDiv>
  );
}