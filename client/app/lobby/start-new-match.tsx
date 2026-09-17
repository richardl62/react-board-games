import { AppGame } from '@/app-game-support/app-game';
import { SetOptions } from '@/option-specification/set-options';
import { useSearchParamData, useSetSearchParam } from '@/url-tools';
import { loadingOrError, LoadingOrError } from '@utils/async-status';
import { BoxWithLegend } from '@utils/box-with-legend';
import { JSX, useMemo, useState } from 'react';
import { useAsyncCallback } from 'react-async-hook';
import { OfflineOptions } from '../offline-options';
import { fullOptionSpecification } from './full-option-specification';
import { lobbyClient } from './lobby-client';
import { defaultValues } from '@/option-specification/tools';
import styled from 'styled-components';

const OuterDiv = styled.div`
  display: inline-flex;
  flex-direction: column;
`;

export function StartNewMatch(props: {
  game: AppGame;
  setOfflineOptions: (opts: OfflineOptions) => void;
}): JSX.Element {
  const { game, setOfflineOptions } = props;
  const { addMatchID } = useSetSearchParam();
  const { seed: seedParam } = useSearchParamData();
  const optionsSpec = useMemo(() => fullOptionSpecification(game), [game]);

  const [options, setOptions] = useState(defaultValues(optionsSpec));

  const asyncCreateMatch = useAsyncCallback((arg: { numPlayers: number; setupData: unknown }) => {
    const randomSeed = seedParam ?? Math.random();
    return lobbyClient
      .createMatch({
        gameName: game.name,
        numPlayers: arg.numPlayers,
        randomSeed,
        setupData: arg.setupData,
      })
      .then((m) => addMatchID({ mid: m.matchID }));
  });

  if (loadingOrError(asyncCreateMatch)) {
    return <LoadingOrError status={asyncCreateMatch} activity="starting match" />;
  }

  const doStartNewMatch = () => {
    if (options.offline) {
      setOfflineOptions({
        ...options,

        // KLUDGE - includes more that just the values from game.setupValues
        setupData: options,
      });
    } else {
      void asyncCreateMatch.execute({
        numPlayers: options.numPlayers,
        setupData: options,
      });
    }
  };

  // Kludge? User facing text uses 'game' rather than 'match'.
  return (
    <BoxWithLegend legend="Start New Game">
      <OuterDiv>
        <SetOptions specification={optionsSpec} options={options} setOptions={setOptions} />
        <button onClick={() => doStartNewMatch()}>Start Game</button>
      </OuterDiv>
    </BoxWithLegend>
  );
}
