import styled from 'styled-components';

export const ScoringOptionDiv = styled.div<{ underline?: boolean }>`
    ${props => props.underline && 'text-decoration: underline;'}
`;

export const ScoringOptionsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(2, 1fr);

    background-color: blue;
    color: white;
    
    & > * {
        border: 1px solid black;
        
    }

    border: 2px solid black;
`;

