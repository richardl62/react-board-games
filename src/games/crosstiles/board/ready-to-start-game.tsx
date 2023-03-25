import React from "react";
import styled from "styled-components";
import { WaitingForPlayers } from "../../../app-game-support";
import { ShowValues } from "../../../app/option-specification/show-values";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { setupOptions } from "../options";
import { GameStage } from "../server-side/server-data";
import { PlayerStatus } from "./player-status";

const OuterDiv = styled.div `
    display: flex;
    flex-direction: column;
    align-items: center;

    > :first-child {
        margin-bottom: 20px;
    }
`;

export function ReadyToStartGame() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, playerData, options, wrappedGameProps } = context;
    const { moves, playerID, allJoined } = wrappedGameProps;

    if(stage !== GameStage.starting) {
        return null;
    }

    const message = (pid: string) => {
        return playerData[pid].readyToStartGame ?
            "Ready" : null;
    };
    
    const ready = playerData[playerID].readyToStartGame;
    return <OuterDiv>
        <ShowValues specification={setupOptions} values={options}/>

        {allJoined ?
            <div>
                {!ready && <button onClick={() => moves.readyToStartGame()}>Ready to start game</button>}
                <PlayerStatus message={message} />
            </div>
            :
            <WaitingForPlayers {...wrappedGameProps} />
        }

    </OuterDiv>;
}
