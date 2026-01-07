import styled from 'styled-components';

export const DiceAndButtonsDiv  = styled.div`
    display: flex;
    flex-direction: row;
`;

export const DiceDiv  = styled.div`
`;

const buttonDivHieght = "100px";

export const ButtonsDiv = styled.div`
    display: flex;
    flex-direction: row;

    height: ${buttonDivHieght};
    width: calc(4 * ${buttonDivHieght});
`;

export const NoOptionRollButton = styled.div`
    display: flex;
    width: 100%;
    height: 100%;

    font-size: calc(0.6 * ${buttonDivHieght});
    font-family: Roboto;

    justify-content: center;
    align-items: center;

    color: darkblue;
    background-color: lightgrey;
    border: 1px solid black;
`;

export const BustButton = styled(NoOptionRollButton)`
    background-color: red;
    color: white;
`;


export const ScoringOptionDiv = styled.div<{ underline?: boolean }>`
    ${props => props.underline && 'text-decoration: underline;'}
`;

export const ScoringOptionsGrid = styled.div`
    display: grid;
    width: 100%;
    height: 100%;

    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);

    background-color: blue;
    color: white;
    
    & > * {
        border: 1px solid black;
    }
    border: 2px solid black;
`;

