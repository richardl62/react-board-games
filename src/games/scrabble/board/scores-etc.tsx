import React from "react";
import styled from "styled-components";
import { GameWarnings } from "../../../game-support/show-warning";
import { nNonNull } from "../../../shared/tools";
import { GameProps } from "./game-props";

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
export function ScoresEtc(props: GameProps): JSX.Element {


    const scoreElems = props.bgioProps.playOrder.map(pid => {
        const name = props.bgioProps.name(pid);
        const score = props.playerData[pid].score;
        const nInRack = nNonNull(props.playerData[pid].rack);

        let displayName = name;
        if (pid === props.bgioProps.playerID) {
            displayName += " (you)";
        }
        
        let nInRackText = "";
        if(pid !== props.bgioProps.playerID && props.bag.length === 0) {
            nInRackText = ` (${nInRack} tiles in rack) `;
        }

        return (
            <div key={name} >
                <PlayerScore current={pid === props.bgioProps.currentPlayer} >
                    {`${displayName}: ${score}`}
                </PlayerScore>
                <NumTilesInRack>{nInRackText}</NumTilesInRack>
            </div>
        );
    });

    return (
        <div>
            <StyledScoresEtc> {scoreElems} </StyledScoresEtc>
            <GameWarnings {...props.bgioProps}/>
        </div>
    );
}