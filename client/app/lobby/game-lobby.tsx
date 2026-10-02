import { AppGame } from '@/app-game-support/app-game';
import { standardOuterMargin } from '@/app-game-support/styles';
import { JSX } from 'react';
import { useAsync } from 'react-async-hook';
import styled from 'styled-components';
import { OfflineOptions } from '../offline-options';
import { lobbyClient } from './lobby-client';
import { MatchLobbyWithApiInfo } from './match-lobby';
import { StartNewMatch } from './start-new-match';

const GameLobbyDiv = styled.div`
  display: inline-flex;
  flex-direction: column;

  margin: ${standardOuterMargin};
`;

export function GameLobby(props: {
  game: AppGame;
  setOfflineOptions: (opts: OfflineOptions) => void;
}): JSX.Element {
  const { game, setOfflineOptions } = props;
  const asyncMatchList = useAsync(() => lobbyClient.listMatches({ gameName: game.name }), []);

  const matches = asyncMatchList.result?.matches;
  const listMatchesFailed = asyncMatchList.error !== undefined;

  // Return early while loading as listMatchedFailed is not reliable until the load
  // has completed.
  if (asyncMatchList.loading) {
    return <GameLobbyDiv>Getting list of matches...</GameLobbyDiv>;
  }

  return (
    <GameLobbyDiv>
      {listMatchesFailed && <div>Cannot obtain list of matches: defaulting to offline play</div>}

      {matches?.map((match) => (
        <MatchLobbyWithApiInfo key={match.matchID} game={game} match={match} />
      ))}

      <StartNewMatch
        game={game}
        setOfflineOptions={setOfflineOptions}
        offlineByDefault={listMatchesFailed}
      />
    </GameLobbyDiv>
  );
}
