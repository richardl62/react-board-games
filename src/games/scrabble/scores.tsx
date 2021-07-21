import styled from "styled-components";
import { GameData } from "./game-data";

const StyledScores=styled.div`
    display: flex;
    justify-content: space-between;
    font-size: large;
`;

const PlayerScore=styled.div<{current: boolean}>`
    text-decoration: ${props => props.current ? 'underline' : 'none'};
`;

interface ScoresProps {
    G: GameData
}
export function Scores({G} : ScoresProps) {
    return <StyledScores>
        {G.playerData.map((pd,index)=> (
            <PlayerScore key={pd.name} current={index === G.currentPlayer} >
                {`${pd.name}: ${pd.score}`}
            </PlayerScore>
        ))}
    </StyledScores>
}