import { diceSize } from '@/utils/dice/dice';
import { sAssert } from '@shared/utils/assert';
import styled from 'styled-components';

const buttonFont = "Roboto";
const buttonDivHieght = "100px";
const buttonDivWidth = "400px";

export const DiceAndButtonsDiv  = styled.div`
    display: flex;
    flex-direction: row;

    align-items: center;
`;

export const TwoDiceDiv  = styled.div`
    display: flex;
    flex-direction: column;
    
    justify-content: space-between;

    height: calc(2.4*${diceSize});

    margin: 0 10px;
`;

export const ButtonsDiv = styled.div`
    display: flex;
    flex-direction: row;

    height: ${buttonDivHieght};
    width: ${buttonDivWidth};
`;

export const NoOptionRollButton = styled.div`
    display: flex;
    width: 100%;
    height: 100%;

    font-size: calc(0.6 * ${buttonDivHieght});
    font-family: ${buttonFont};

    justify-content: center;
    align-items: center;

    color: darkblue;
    background-color: lightgrey;
    border: 1px solid black;
`;

export const BustButton = styled(NoOptionRollButton)`
    color: darkblue;
`;

export const RollDontButton = styled.button`
    width: calc(0.2 * ${buttonDivWidth});
`

export const ScoringOptionButton = styled.div<{ underline?: boolean }>`
    display: flex;
    ${props => props.underline && 'text-decoration: underline;'}

    justify-content: center;
    align-items: center;
    
    font-size: calc(0.20 * ${buttonDivHieght});
    font-family: ${buttonFont};

    background-color: blue;
    color: white;
`;

export const ScoringOptionsGrid = styled.div`
    display: grid;
    width: 100%;
    height: 100%;

    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);

    & > * {
        border: 1px solid black;
    }
    border: 2px solid black;
`;

export const squareBorder = "2px solid darkred";

const playerColors = ["red", "green", "blue", "yellow"];
export const temporaryOwnerColor = "grey";

export function playerColor(playerID: string) {
    const player = parseInt(playerID, 10);
    sAssert(player >= 0 && player < playerColors.length, `Invalid player number: ${player}`);
    return playerColors[player];
}

