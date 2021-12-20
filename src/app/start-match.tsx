import React, { useState } from "react";
import styled from "styled-components";
import { AppGame } from "../shared/types";
import { TestDebugBox } from "../shared/test-debug-box";
import * as LobbyClient from "../bgio";
import { getOfflineMatchLink, openOnlineMatchPage } from "./url-params";
import { useAsyncCallback } from "react-async-hook";
import { waitingOrError, WaitingOrError } from "../shared/waiting-or-error";
const OuterDiv = styled.div`
  display: inline-flex;
  flex-direction: column;
`;

const OfflineLinkDiv = styled.div`
  label {
    margin-left: 8px;
  }

  input {
    margin-left: 4px;
  }
`;

function snapToRange(val: number, low: number, high: number) : number {
    if (val < low) {
        return low;
    }
    if (val > high) {
        return high;
    }
    return val;
}

interface StartGameProps {
  game: AppGame;
}

export function StartMatch({ game }: StartGameProps): JSX.Element {
    const { minPlayers, maxPlayers } = game;

    const defaultNumPlayers = snapToRange(2 /*arbitrary*/, minPlayers, maxPlayers);

    const [numPlayers, setNumPlayers] = useState(defaultNumPlayers);
    const [persist, setPersist] = useState(false);

    const asyncCreateMatch = useAsyncCallback(() =>
        LobbyClient.createMatch(game, numPlayers).then(openOnlineMatchPage)
    );

    if(waitingOrError(asyncCreateMatch)) {
        return <WaitingOrError status={asyncCreateMatch} activity="starting match"/>;
    }


    if(asyncCreateMatch.error) {
        return <div>{`ERROR: ${asyncCreateMatch.error.message}`}</div>;
    }

    return (
        <OuterDiv>
            <div>
                <label htmlFor='numPlayers'>
                    {`Number of players (${minPlayers}-${maxPlayers}):`}
                </label>

                <input type="number" name='numPlayers'
                    min={minPlayers} max={maxPlayers}
                    value={numPlayers}
                    onChange={(event) => setNumPlayers(Number(event.target.value))} 
                />
                <button type="button" onClick={asyncCreateMatch.execute} disabled={asyncCreateMatch.loading}>
                     New Game
                </button>
            </div>

            <TestDebugBox>

                <OfflineLinkDiv>
                    <a href={getOfflineMatchLink(numPlayers, persist)}>Play offline</a>

                    <label>
                        Persistent Storage
                        <input
                            type="checkbox"
                            value={persist ? 1 : 0}
                            onChange={() => { setPersist(!persist); }}
                        />
                    </label>
                </OfflineLinkDiv>

            </TestDebugBox>

        </OuterDiv>
    );
}
