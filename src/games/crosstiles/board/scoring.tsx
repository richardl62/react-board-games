import React from "react";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";
import { useCrossTilesContext } from "../client-side/actions/cross-tiles-context";
import { displayName } from "../score-categories";
import { scoreCardFull } from "../server-side/score-card";
import { GameStage } from "../server-side/server-data";
import { GridStatus } from "./grid-status";
import { PlayerStatus } from "./player-status";
import { TileGrid } from "./tile-grid";

const ScoringDiv = styled.div`
    display: flex;  
    > * {
        margin-right: 1em;
    }
`;

const Header = styled.div`
    font-weight: bold;    
`;

const GridAndRack = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 2px;
    > *:first-child {
        margin-bottom: 4px;
    };
`;

interface CompletedGridProps {
    pid: string;
}

function CompletedGrid({pid}: CompletedGridProps) {
    const context = useCrossTilesContext();
    const { playerData } = context;
    const { getPlayerName } = context.wrappedGameProps;

    const name = getPlayerName(pid);
    const { scoreCard, gridRackAndScore, chosenCategory } = playerData[pid];
    sAssert(gridRackAndScore, "Unexpected null grid");
    const {grid, rack } = gridRackAndScore;
    
    // Kludge??: Ignore any recently chosed option when showing
    // the grid status. This avoids misleading reported status, e.g.
    // that a recently scored options is unavailable. 
    const originalScoreCard = {...scoreCard};
    if (chosenCategory) {
        originalScoreCard[chosenCategory] = undefined;
    }
    
    const noScoreMessage = () => {
        if (chosenCategory) {
            return `Zero for ${displayName[chosenCategory]}`;
        }
        return "Must set a score to zero";
    };
    
    return <div>
        <Header>{name}</Header>
        <GridAndRack>
            <TileGrid letters={[rack]} />
            <TileGrid letters={grid} />
        </GridAndRack>
        <GridStatus grid={grid} scoreCard={originalScoreCard} noScoreMessage={noScoreMessage} />
    </div>;
}

export function Scoring() : JSX.Element | null {
    const context = useCrossTilesContext();
    const { stage, playerData, nPlayers, nthPlayerID,
        wrappedGameProps: {moves, playerID} 
    } = context;
    
    if(stage !== GameStage.scoring) {
        return null;
    }
    const scoreChosen = Boolean(playerData[playerID].chosenCategory); 
    const amReady = playerData[playerID].readyForNextRound;

    const readyMessage = (pid: string) =>
        playerData[pid].readyForNextRound ? "Ready" : null;

    const endOfGame = scoreCardFull(playerData[playerID].scoreCard); //KLUDGE?
    
    const completedGrids : JSX.Element[] = [];
    for (let i = 0; i < nPlayers; ++i) {
        const pid = nthPlayerID(i);
        completedGrids.push(<CompletedGrid key={pid} pid={pid} />);
    }

    return <div>
        <ScoringDiv> {completedGrids} </ScoringDiv>

        {scoreChosen && !amReady &&
            <button onClick={()=>moves.readyForNextRound()}>
                {endOfGame ? "Ready for final scores" : "Ready for Next Round"}
            </button>
        }
        <PlayerStatus message={readyMessage} />
    </div>;
}

