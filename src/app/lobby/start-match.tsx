import React, { useState } from "react";
import { useAsyncCallback } from "react-async-hook";
import styled from "styled-components";
import { AppGame } from "../../app-game-support";
import { loadingOrError, LoadingOrError } from "../../utils/async-status";
import { BoxWithLegend } from "../../utils/box-with-legend";
import { createMatch } from "./lobby-tools";
import { openOnlineMatchPage } from "../url-params";
import { OfflineOptions } from "../offline-options";

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


export function StartMatch(props: {
    game: AppGame;
    setOfflineOptions: (opts: OfflineOptions) => void;
  }): JSX.Element {
    const { game, setOfflineOptions } = props;
    const {minPlayers, maxPlayers } = game;

    const defaultNumPlayers = snapToRange(2 /*arbitrary*/, minPlayers, maxPlayers);

    const [numPlayers, setNumPlayers] = useState(defaultNumPlayers);
    const [debugPanel, setDebugPanel] = useState(false);

    const asyncCreateMatch = useAsyncCallback(() =>
        createMatch(game, numPlayers).then(openOnlineMatchPage)
    );

    if(loadingOrError(asyncCreateMatch)) {
        return <LoadingOrError status={asyncCreateMatch} activity="starting match"/>;
    }

    const doSetOfflineOptions = () => setOfflineOptions({
        numPlayers,
        debugPanel
    });

    return <OuterDiv>
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
                <label>
                    Debug Panel
                    <input
                        type="checkbox"
                        value={debugPanel ? 1 : 0}
                        onChange={() => { setDebugPanel(!debugPanel); }}
                    />
                </label>
                <button type="button" onClick={doSetOfflineOptions} >
                    Offline Game
                </button>
            </OfflineLinkDiv>

        </BoxWithLegend>

    </OuterDiv>;
}
