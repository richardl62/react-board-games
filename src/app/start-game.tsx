import React, { useState } from "react";
import styled from "styled-components";
import { AppGame } from "../shared/types";
import { TestDebugBox } from "../shared/test-debug-box";
import { getOfflineMatchLink } from "./open-match-page";
import { openOnlineMatchPage } from "./open-match-page";
import { useWaitingOrError, WaitingOrError } from "../shared/waiting-or-error";
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

export interface StartGameOptions {
  local: boolean;
  nPlayers: number;
}

interface StartGameProps {
  game: AppGame;
}


export function StartGame({ game }: StartGameProps): JSX.Element {
    const { minPlayers, maxPlayers } = game;

    const defaultNumPlayers = snapToRange(2 /*arbitrary*/, minPlayers, maxPlayers);

    const [numPlayers, setNumPlayers] = useState(defaultNumPlayers);
    const [persist, setPersist] = useState(false);
    const [waitingOrError, setWaitingOrError] = useWaitingOrError();

    const startGame = () => openOnlineMatchPage({
        game:game, 
        nPlayers: numPlayers,
        setWaiting: () => setWaitingOrError("waiting"),
        setError: setWaitingOrError,
    });

    if (waitingOrError) {
        return <WaitingOrError status={waitingOrError}
            waitingMessage="waiting for server"
        />;
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
                <button type="button" onClick={() => startGame()}>
                      Start Game
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