import React, { useState } from 'react';
import styled from 'styled-components';
import { AppGame } from '../shared/types';
import { TestDebugBox } from '../shared/test-debug-box';

const OuterDiv = styled.div`
  display: inline-flex;
  flex-direction: column;
`;

export interface MatchOptions {
  local: boolean;
  nPlayers: number;
}

interface StartMatchProps {
    game: AppGame;
    optionsCallback: (arg: MatchOptions) => void;
  }

export function StartMatchOptions(
  {
    game: { minPlayers, maxPlayers }, 
    optionsCallback: startMatch
  }: StartMatchProps) {

  const defaultNumPlayers = Math.max(minPlayers, 2);
  const [numPlayers, setNumPlayers] = useState<number>(defaultNumPlayers);

  return (
    <OuterDiv>

      <div>
        <label htmlFor='numPlayers'>
          {`Number of players (${minPlayers}-${maxPlayers}):`}
        </label>

        <input type="number" name='numPlayers'
          min={minPlayers} max={maxPlayers}
          value={numPlayers}
          onChange={(event) => setNumPlayers(Number(event.target.value))} />
        <button type="button" onClick={() => startMatch({ nPlayers: numPlayers, local: false })}>
          Start Game
        </button>
      </div>

      <TestDebugBox>
        <button type="button" onClick={() => startMatch({ nPlayers: numPlayers, local: true })}>
          Start Offline
        </button>
      </TestDebugBox>

    </OuterDiv>
  );
}
