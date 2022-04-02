import React from "react";
import styled from "styled-components";
import { GameWarnings } from "../../../app-game-support";
import { nNonNull } from "../../../utils/n-non-null";
import { useScrabbleContext } from "../client-side-actions/scrabble-context";

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

    const scoreElems = context.wrappedGameProps.ctx.playOrder.map(pid => {
        const name = context.wrappedGameProps.getPlayerName(pid);
        const score = context.playerData[pid].score;
        const nInRack = nNonNull(context.playerData[pid].rack);
        
        let nInRackText = "";
        if(pid !== context.wrappedGameProps.playerID && context.nTilesInBag === 0) {
            nInRackText = ` (${nInRack} tiles in rack) `;
        }

        return (
            <div key={name} >
                <PlayerScore current={pid === context.currentPlayer} >
                    {`${name}: ${score}`}
                </PlayerScore>
                <NumTilesInRack>{nInRackText}</NumTilesInRack>
            </div>
        );
    });

    return (
        <div>
            <StyledScoresEtc> {scoreElems} </StyledScoresEtc>
            <GameWarnings {...context.wrappedGameProps}/>
        </div>
    );
}