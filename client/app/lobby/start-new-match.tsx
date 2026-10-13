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
import { defaultValues, specifiedValues } from '@/option-specification/tools';
import styled from 'styled-components';
import { matchOptionSpecification } from '../match-option-specification';
import { MatchOptions } from '@shared/match-options';

const OuterDiv = styled.div`
  display: inline-flex;
  flex-direction: column;
`;

export function StartNewMatch(props: {
  game: AppGame;
  setOfflineOptions: (opts: OfflineOptions) => void;
  offlineByDefault: boolean;
}): JSX.Element {
  const { game, setOfflineOptions, offlineByDefault } = props;
  const { addMatchID } = useSetSearchParam();
  const { seed: seedParam } = useSearchParamData();
  const optionsSpec = useMemo(
    () => fullOptionSpecification(game, offlineByDefault),
    [game, offlineByDefault],
  );

  const [options, setOptions] = useState(defaultValues(optionsSpec));

  const asyncCreateMatch = useAsyncCallback(
    (arg: { numPlayers: number; setupData: unknown; matchOptions: MatchOptions }) => {
      const randomSeed = seedParam ?? Math.random();
      return lobbyClient
        .createMatch({
          gameName: game.name,
          numPlayers: arg.numPlayers,
          randomSeed,
          setupData: arg.setupData,
          matchOptions: arg.matchOptions,
        })
        .then((m) => addMatchID({ mid: m.matchID }));
    },
  );

  if (loadingOrError(asyncCreateMatch)) {
    return <LoadingOrError status={asyncCreateMatch} activity="starting match" />;
  }

  const doStartNewMatch = () => {
    // The values of the game's own options.
    const setupData = specifiedValues(game.options ?? {}, options);
    const matchOptions = specifiedValues(matchOptionSpecification, options);
    if (options.offline) {
      setOfflineOptions({
        numPlayers: options.numPlayers,
        passAndPlay: options.passAndPlay,
        setupData,
        matchOptions,
      });
    } else {
      void asyncCreateMatch.execute({
        numPlayers: options.numPlayers,
        setupData,
        matchOptions,
      });
    }
  };

  // Kludge? User facing text uses 'game' rather than 'match'.
  return (
    <BoxWithLegend legend="Start New Game">
      <OuterDiv>
        <SetOptions
          specification={optionsSpec}
          options={options}
          setOptions={setOptions}
          showDebugOnly={options.showDebugOptions}
        />
        <button onClick={() => doStartNewMatch()}>Start Game</button>
      </OuterDiv>
    </BoxWithLegend>
  );
}
