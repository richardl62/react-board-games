import React from "react";
import { useAsyncCallback } from "react-async-hook";
import { AppGame } from "../../app-game-support";
import { loadingOrError, LoadingOrError } from "../../utils/async-status";
import { BoxWithLegend } from "../../utils/box-with-legend";
import { createMatch } from "./lobby-tools";
import { openOnlineMatchPage } from "../url-params";
import { OfflineOptions } from "../offline-options";
import { SpecifiedValues } from "../../app-game-support/value-specification";
import { InputValues } from "../../app-game-support/value-specification/input-values";

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

    const optionsSpec = {
        numPlayers: {
            label: "Number of players",
            default: snapToRange(2 /*arbitrary*/, minPlayers, maxPlayers),
            min: minPlayers,
            max: maxPlayers,
        },
        offline: {
            label: "Play offline (test/debug)",
            default: false,
        },
        debugPanel: {
            label: "Debug panel (offline only)",
            default: false,
        }
    };
    
    const asyncCreateMatch = useAsyncCallback((arg: {numPlayers: number}) =>
        createMatch(game, arg.numPlayers).then(openOnlineMatchPage)
    );

    if(loadingOrError(asyncCreateMatch)) {
        return <LoadingOrError status={asyncCreateMatch} activity="starting match"/>;
    }

    const startGame=(options: SpecifiedValues<typeof optionsSpec>) => {
        if(options.offline) {
            setOfflineOptions(options);
        } else {
            asyncCreateMatch.execute(options);
        }
    };

    return <BoxWithLegend legend="Start New Game">
        <InputValues specification={optionsSpec} setValues={startGame} />
    </BoxWithLegend>;
}
