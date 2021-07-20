import { GameData } from "./game-data";

interface ScoresProps {
    G: GameData
}
export function Scores({G} : ScoresProps) {
    return <div>
        {G.playerData.map(pd=> (
            <div key={pd.name}>
                {`${pd.name}: ${pd.score}`}
            </div>
        ))}
    </div>
}