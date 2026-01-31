import { AppGame } from "@/app-game-support";
import { JSX, useMemo, useState } from "react";
import styled from "styled-components";
import { OfflineOptions } from "../../offline-options";
import { GameBoardWrapper } from "../game-board-wrapper";
import { makeInitialMatchData } from "./make-initial-match-data";
import { Ctx } from "@shared/game-control/ctx";
import { makePlayerActions } from "./make-player-actions";
import { useSearchParamData } from "@/url-tools";
import { RandomAPI, seededDraw } from "@shared/utils/random-api";

const OptionalDisplay = styled.div<{display_: boolean}>`
    display: ${props => props.display_? "block" : "none"};
`;

function useRandomAPI() {
    const {seed: seedParam} = useSearchParamData(); // Returns number >= 0 or null
    return useMemo(() => {
        // seed must be in [0,1]
        const seed = (seedParam === null) ? Math.random() : 1.0 / (seedParam+1);
        return new RandomAPI(seededDraw(seed));
    }, [seedParam]);

}
export function MatchPlayOffline({game, options}: {
    game:AppGame,
    options: OfflineOptions,
}): JSX.Element {

    const {numPlayers, passAndPlay,  setupData} = options;

    const random = useRandomAPI();
    
    const [ matchData, setMatchData ] = useState(
        makeInitialMatchData(game, numPlayers, random, setupData)
    );

    const ctx = new Ctx(matchData.ctxData);

    const boards : JSX.Element[] = [];
    for (const playerID of ctx.playOrder) {
        
        const { moves, events } = makePlayerActions(
            game, playerID, random, matchData, setMatchData
        );

        // Create a board that is optionally displayed. (Early code created either a board
        // or a blank element. However, this caused the Scrabble dictionary to be reloaded 
        // on each move. Presumably, this was because the compoment was unloaded and reloaded
        // each time.)
        const board = <GameBoardWrapper 
            game={game}
            playerID={playerID}
            connectionStatus={"connected"}
            serverMatchData={matchData}
            actionRequestStatus={{ waitingForServer: false, lastActionIgnored: false }}
            errorInLastAction={matchData.errorInLastAction}
            moves={moves}
            events={events}
        />

        const show = !passAndPlay || playerID === ctx.currentPlayer;
        boards.push(<OptionalDisplay  key={playerID} display_={show}> 
            {board}
        </OptionalDisplay>); 
    }

    return <div>{boards}</div>; 
}

