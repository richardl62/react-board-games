import { JSX } from "react";
import { useAsyncCallback } from "react-async-hook";
import { AppGame } from "../../app-game-support";
import { loadingOrError, LoadingOrError } from "@utils/async-status";
import { BoxWithLegend } from "@utils/box-with-legend";
import { useSetSearchParam } from "@/url-tools";
import { OfflineOptions } from "../game-page/offline-options";
import { SpecifiedValues } from "../../option-specification/types";
import { InputValues } from "../../option-specification/input-values";
import { lobbyClient } from "./lobby-client";
import { fullOptionSpecification } from "./full-option-specification";

export function StartMatch(props: {
    game: AppGame;
    setOfflineOptions: (opts: OfflineOptions) => void;
  }): JSX.Element {
    const { game, setOfflineOptions } = props;
    const { addMatchID } = useSetSearchParam();
    const optionsSpec = fullOptionSpecification(game);
    
    const asyncCreateMatch = useAsyncCallback(
        (arg: {numPlayers: number, setupData: unknown}) =>
            lobbyClient.createMatch({ 
                gameName: game.name, 
                numPlayers: arg.numPlayers,
                setupData: arg.setupData 
            }).then(m => addMatchID({mid: m.matchID}))
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

    // Kludge? User facing text uses 'game' rather than 'match'.
    return <BoxWithLegend legend="Start New Game">
        <InputValues specification={optionsSpec} 
            buttonText={"Start Game"}
            onButtonClick={startGame} 
        />
    </BoxWithLegend>;
}
