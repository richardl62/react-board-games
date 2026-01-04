import { Scores } from "./scores";
import { GameButtons } from "./game-buttons";
import { ScorePads } from "./score-pads";
import styled from "styled-components";
import { GameDiceSet } from "./game-dice-set";
import { ScoringCombinations } from "./scoring-combinations";
import { useMatchState } from "../client-side/match-state";
import { FinalScores } from "./final-scores";
import { LastRoundNotice } from "./last-round-notice";
import { JSX } from "react";

const OuterDiv = styled.div`
    display: flex;
    flex-direction: column;
    // Do not stretch content
    align-items: flex-start;

    padding: 10px;

    a {
        font-size: 18px;
    }
    
    //Add padding between items, EXCEPT the last item
    & > *:not(:last-child) {
        margin-bottom: 6px;
    }
`;

function Board() : JSX.Element {
    const {
        G: {lastRound},
        ctx: {matchover}
    } = useMatchState();

    return <OuterDiv>
        {lastRound && !matchover && <LastRoundNotice/>}
        <GameButtons/>
        <GameDiceSet/>
        {matchover ? <FinalScores /> : <Scores/>}
        <ScorePads />
        <ScoringCombinations/>
    </OuterDiv>;
}

export default Board;
