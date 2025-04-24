import { JSX } from "react";
import styled from "styled-components";
import { useGameContext } from "../client-side/game-context";
import React from "react";
type DiceScore = [
    //dice values
    number[] | string | null,
    //score 
    number | null
];

const diceScores  = (allSameScore: number) : DiceScore[][] => [
    [
        [[1], 100],
        [[5], 50],
        [null, null],
        [null, null],
        [null, null],
        [null, null],
    ],
    [
        [[1, 1, 1], 1000],
        [[2, 2, 2], 200],
        [[3, 3, 3], 300],
        [[4, 4, 4], 400],
        [[5, 5, 5], 500],
        [[6, 6, 6], 600],
    ],
    [
        [[1, 2, 3, 4, 5, 6], 1500],
        ["Three pairs", 500],
        ["All the same", allSameScore],
        [null, null],
        [null, null],
        [null, null],
    ],
];

const ScoreTable = styled.table`
    border-collapse: collapse;
    border: 1px solid black;
    
    th {
        border-bottom: 1px solid black;
    }

    td, th {
        border-left: 1px solid black;
        font-size: 18px;
        text-align: left;
        height: 22px;
        padding-right: 1em;
    }
`;

const Dice = styled.td`
    padding-right: 2em;  
`;
function Column({diceScores: scores} : 
    {diceScores: DiceScore[]}
)
{
    const diceString = (dice: number[] | string | null) : string => {
        if (typeof dice === "string") {
            return dice;
        }
        if (dice === null) {
            return "";
        }
        return dice.join(" ");
    };

    return <ScoreTable>
        <thead>
            <tr>
                <th>Dice</th>
                <th>Score</th>
            </tr>
        </thead>
        {scores.map(([dice, score], index) => 
            <tr key={index}>
                <Dice>{diceString(dice)}</Dice>
                <td>{score}</td>
            </tr>
        )}
    </ScoreTable>;
}

const ColumnsDiv = styled.div`
    display: flex;
    flex-direction: row;
    border: 1px solid black;

    background-color: cornsilk;
`;
export function ScoringCombinations() : JSX.Element {
    const {G: {options}} = useGameContext();

    const [show, setShow] = React.useState(false);
    const toggleShow = () => setShow(!show);

    return <div>
        <label>
            <input type="checkbox" checked={show} onChange={toggleShow}/>
            Show scoring combinations
        </label>
        {show && <ColumnsDiv>
            {diceScores(options.scoreToWin).map((scores, index) =>
                <Column key={index} diceScores={scores} />
            )}
        </ColumnsDiv>}
    </div>;

}