import React from "react";
import styled from "styled-components";
import { GameWarnings } from "../../../game-support/show-warning";
import { nNonNull } from "../../../shared/tools";
import { useScrabbleContext } from "../scrabble-context";

const StyledScoresEtc=styled.div`
    display: flex;
    justify-content: space-between;
    font-size: large;
`;

const PlayerScore=styled.span<{current: boolean}>`
    text-decoration: ${props => props.current ? "underline" : "none"};
`;

const NumTilesInRack=styled.span`
    font-size: 80%;
`;

// To do: Think of a better name
export function ScoresEtc(): JSX.Element {
    const context = useScrabbleContext();

    const scoreElems = context.bgioProps.playOrder.map(pid => {
        const name = context.bgioProps.name(pid);
        const score = context.playerData[pid].score;
        const nInRack = nNonNull(context.playerData[pid].rack);

        let displayName = name;
        if (pid === context.bgioProps.playerID) {
            displayName += " (you)";
        }
        
        let nInRackText = "";
        if(pid !== context.bgioProps.playerID && context.bag.length === 0) {
            nInRackText = ` (${nInRack} tiles in rack) `;
        }

        return (
            <div key={name} >
                <PlayerScore current={pid === context.bgioProps.currentPlayer} >
                    {`${displayName}: ${score}`}
                </PlayerScore>
                <NumTilesInRack>{nInRackText}</NumTilesInRack>
            </div>
        );
    });

    return (
        <div>
            <StyledScoresEtc> {scoreElems} </StyledScoresEtc>
            <GameWarnings {...context.bgioProps}/>
        </div>
    );
}