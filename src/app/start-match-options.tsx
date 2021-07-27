import React, { useState } from 'react';
import styled from 'styled-components';
import { AppGame } from '../shared/types';

const OuterDiv = styled.div`
  display: inline-flex;
  flex-direction: column;
`;

const Box = styled.div`
  position: relative;
  border: 1px dashed black;
  border-radius: 5px;
  margin-top: 20px;
`;

const Legend = styled.div`
  width: fit-content;
  position: inherit;
  background-color: white;
  top: -10px;
  left: 30px;
`;

export interface StartMatchParams {
    nPlayers: number;
    offline: boolean;
  }
  
interface StartMatchProps {
    game: AppGame;
    setOptions: (arg: StartMatchParams) => void;
  }

export function StartMatchOptions(
  {
    game: { minPlayers, maxPlayers }, setOptions: startMatch
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
        <button type="button" onClick={() => startMatch({ nPlayers: numPlayers, offline: false })}>
          Start Game
        </button>
      </div>

      <Box>
        <Legend>Test/debug</Legend>

        <button type="button" onClick={() => startMatch({ nPlayers: numPlayers, offline: true })}>
          Start Offline
        </button>
      </Box>

    </OuterDiv>
  );
}
