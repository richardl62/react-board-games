import styled from 'styled-components';

export const colors = {
    boardBackground: 'rgb(100,0,0)',  /* Dark brown*/
    BoarderText: 'white',
    blackSquare: 'rgb(165,42,42)', /* brown */
    whiteSquare: 'rgb(255,248,220)', /* cornsilk */
    squareHighlight: 'rgb(200,200,100)', /* dark yellow */
    activeSquareHighlight: 'rgb(200 200 100)', /* dark yellow */
}


export const RectangularBoard = styled.div<{nCols: number, internalBorders: boolean}>`        
    display: inline-grid;
    background-color: ${colors.boardBackground};
    grid-template-columns: ${props => `repeat(${props.nCols},auto)`};
    
    grid-gap: ${props => props.internalBorders ? "2px" : "none"};
    border: ${props => props.internalBorders ? 
        `10px solid ${colors.boardBackground}` : "none"};
`; 

export const GridSquareBackground = styled.div<{color: string}>`

    width: 50px;
    height: 50px;

    position: relative;
    background-color: ${props => props.color};
    &:hover { 
        --backgroundHoverBoarder: 4px;
        border:  var(--backgroundHoverBoarder) solid ${colors.activeSquareHighlight}
        };
`;

export const GridSquareElement = styled.div`

    width: 50px;
    height: 50px;
    font-size: 50px; //tmp
    position: absolute;
    box-sizing: 3px;

    // KLUDGE?
    top: calc(-1 * var(--backgroundHoverBoarder, 0));
    left: calc(-1 * var(--backgroundHoverBoarder, 0));

    z-index: 1;
`;

export const BorderLetter = styled.div`
    font-size: 20px;
    padding: 3px 0;
    color: ${colors.BoarderText};
    text-align: center;
`;

export const BorderNumber = styled.div`
    font-size: 25px;
    padding: 0 7px;
    color: ${colors.BoarderText};
    margin: auto;
`;