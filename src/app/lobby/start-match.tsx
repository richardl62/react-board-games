import { JSX } from "react";
import { useAsyncCallback } from "react-async-hook";
import { AppGame, MatchID } from "../../app-game-support";
import { loadingOrError, LoadingOrError } from "@utils/async-status";
import { BoxWithLegend } from "@utils/box-with-legend";
import { useSetSearchParam } from "@/url-tools";
import { OfflineOptions } from "../game-page/offline-options";
import { OptionValues, SpecifiedValues } from "../../option-specification/types";
import { InputValues } from "../../option-specification/input-values";
import { defaultNumPlayers } from "../../app-game-support/app-game";
import { sAssert } from "@utils/assert";
import { lobbyClient } from "./lobby-client";

async function createMatch(
    game: AppGame,
    options: { numPlayers: number, setupData: unknown },
): Promise<MatchID> {
    const p = lobbyClient.createMatch({ 
        gameName: game.name, 
        numPlayers: options.numPlayers,
        setupData: options.setupData 
    });
    const m = await p;
    return { mid: m.matchID };
}

export function StartMatch(props: {
    game: AppGame;
    setOfflineOptions: (opts: OfflineOptions) => void;
  }): JSX.Element {
    const { game, setOfflineOptions } = props;
    const {minPlayers, maxPlayers } = game;

    const gameOptions = game.options || {};

    const { addMatchID } = useSetSearchParam();

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
    } as const;
    
    const asyncCreateMatch = useAsyncCallback((arg: {numPlayers: number, setupData: unknown}) =>
        createMatch(game, arg).then(addMatchID)
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
