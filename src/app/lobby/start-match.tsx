import React from "react";
import { useAsyncCallback } from "react-async-hook";
import { AppGame } from "../../app-game-support";
import { loadingOrError, LoadingOrError } from "../../utils/async-status";
import { BoxWithLegend } from "../../utils/box-with-legend";
import { createMatch } from "./lobby-tools";
import { openOnlineMatchPage } from "../url-params";
import { OfflineOptions } from "../offline-options";
import { OptionValues, SpecifiedValues } from "../option-specification/types";
import { InputValues } from "../option-specification/input-values";
import { defaultNumPlayers } from "../../app-game-support/app-game";
import { sAssert } from "../../utils/assert";

export function StartMatch(props: {
    game: AppGame;
    setOfflineOptions: (opts: OfflineOptions) => void;
  }): JSX.Element {
    const { game, setOfflineOptions } = props;
    const {minPlayers, maxPlayers } = game;

    const gameOptions = game.options || {};

    const optionsSpec = {
        numPlayers: {
            label: "Number of players",
            default: defaultNumPlayers(game),
            min: minPlayers,
            max: maxPlayers,
        },

        ...gameOptions,

        showDebugOptions: {
            label: "Show debug options",
            default: false,
        },
        offline: {
            label: "Play offline",
            default: false,
            debugOnly: true,
        },
        passAndPlay: {
            label: "Pass and play (offline only)",
            default: true,
            debugOnly: true,
            showIf: showOfflineOptions,
        },
        debugPanel: {
            label: "Debug panel (offline only)",
            default: false,
            debugOnly: true,
            showIf: showOfflineOptions,
        }
    } as const;
    
    const asyncCreateMatch = useAsyncCallback((arg: {numPlayers: number, setupData: unknown}) =>
        createMatch(game, arg).then(openOnlineMatchPage)
    );

    if(loadingOrError(asyncCreateMatch)) {
        return <LoadingOrError status={asyncCreateMatch} activity="starting match"/>;
    }

    const startGame=(options: SpecifiedValues<typeof optionsSpec>) => {
        if(options.offline) {
            setOfflineOptions({
                ...options,

                // KLUDGE - includes more that just the values from game.setupValues
                setupData: options,
            });
        } else {
            asyncCreateMatch.execute({
                numPlayers: options.numPlayers,
                setupData: options,
            });
        }
    };

    return <BoxWithLegend legend="Start New Game">
        <InputValues specification={optionsSpec} 
            buttonText={"Start Game"}
            onButtonClick={startGame} 
        />
    </BoxWithLegend>;
}

function showOfflineOptions(values: OptionValues) {
    const res = values.offline;
    sAssert(typeof res === "boolean");

    return res;
}
