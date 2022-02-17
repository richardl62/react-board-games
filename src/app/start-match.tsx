import React, { useState } from "react";
import { useAsyncCallback } from "react-async-hook";
import styled from "styled-components";
import { AppGame } from "../app-game-support";
import { loadingOrError, LoadingOrError } from "../utils/async-status";
import { BoxWithLegend } from "../utils/box-with-legend";
import { createMatch } from "./lobby-tools";
import { getOfflineMatchLink, openOnlineMatchPage } from "./url-params";
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
        createMatch(game, numPlayers).then(openOnlineMatchPage)
    );

    if(loadingOrError(asyncCreateMatch)) {
        return <LoadingOrError status={asyncCreateMatch} activity="starting match"/>;
    }

    return (
        <OuterDiv>
            <BoxWithLegend legend="Start New Game">

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
            </BoxWithLegend>

            <BoxWithLegend legend="Test/Debug">

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

            </BoxWithLegend>

        </OuterDiv>
    );
}
