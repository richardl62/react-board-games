import React from "react";
import styled from "styled-components";
import { WaitingForPlayers } from "../../../app-game-support";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { GameStage } from "../server-side/server-data";
import { PlayerStatus } from "./player-status";


const OptionsTable = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    column-gap: 1em;
    
    margin-bottom: 8px;
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

    const optionElems: JSX.Element[] = [];
    const addOption = (name:string, val: number|boolean) => {
        const key = () => optionElems.length;

        const boolStr = (b: boolean) => b ? "True" : "False";
        const valStr = typeof val === "boolean" ? boolStr(val) : val.toString();
        

        optionElems.push(<span key={key()}>{name+":"}</span>);
        optionElems.push(<span key={key()}>{valStr}</span>);

    };
    
    addOption("Time to make grid (secs)", options.timeToMakeGrid);
    addOption("Make grid countdown (secs)", options.makeGridCountdown);
    addOption("Rack size", options.rackSize);
    addOption("Min vowels in rack", options.minVowels);
    addOption("Min consonants in rack", options.minConsonants);
    addOption("Min bonus letters", options.minBonusLetters);
    addOption("All players get same letters", options.playersGetSameLetters);
    addOption("Warn when recording non-scoring grid", options.checkGridBeforeRecoding);  
    if(!options.checkSpelling) {
        addOption("Spelling checks disabled (debug)", true);
    }
    
    const ready = playerData[playerID].readyToStartGame;
    return <div>
        <OptionsTable>{optionElems}</OptionsTable>

        {allJoined ?
            <div>
                {!ready && <button onClick={() => moves.readyToStartGame()}>Ready to start game</button>}
                <PlayerStatus message={message} />
            </div>
            :
            <WaitingForPlayers {...wrappedGameProps} />
        }

    </div>;
}