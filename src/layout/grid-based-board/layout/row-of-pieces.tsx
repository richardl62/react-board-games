import React from 'react';
import styled from 'styled-components';
import { GameControl } from '../control';
import { makePiecePosition } from '../piece-position';
import ControlledSquare from './square';


const RowOfPiecesStyled = styled.div`
    display: flex;
    justify-content: center;
    margin: 5px;
`

function RowOfPieces({ where, gameControl }: {
    where: 'top' | 'bottom',
    gameControl: GameControl,
}) {
    const offBoard = gameControl.offBoardPieces(where);
    return (
        // Kludge? Use outer div to control the size (via class 'square')
        <RowOfPiecesStyled>
            {offBoard.map((_dummy, index) => {
                const pos = makePiecePosition({ [where]: index });

                return (<ControlledSquare key={index} gameControl={gameControl} pos={pos} />);
            }
            )}
        </RowOfPiecesStyled>
    );
}

export default RowOfPieces;