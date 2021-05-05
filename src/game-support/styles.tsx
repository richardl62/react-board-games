import styled from 'styled-components';

const boardBackground = 'rgb(100,0,0)';  /* Dark brown*/
const BoarderText = 'white';
// const blackSquare = 'rgb(165,42,42)'; /* brown */
// const whiteSquare = 'rgb(255,248,220)'; /* cornsilk */
// const squareHighlight = 'rgb(200,200,100)'; /* dark yellow */

export const RectangularBoard = styled.div<{nCols: number}>`        
    display: inline-grid;
    background-color: ${boardBackground};
    grid-template-columns: ${props => `repeat(${props.nCols},auto)`};
`; 

export const BorderLetter = styled.div`
    font-size: 20px;
    padding: 3px 0;
    color: ${BoarderText}
`
export const BorderNumber = styled.div`
    font-size: 25px;
    padding: 0 7px;
    color: ${BoarderText}
`