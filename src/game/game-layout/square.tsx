import React from 'react';
import { useDrop } from 'react-dnd';
import { itemTypes } from '../full-game/constants';
import Piece from '../full-game/controlled-piece';
import GameControl from '../game-control';
import { BoardPosition } from '../../interfaces';

import { nonNull } from './../../tools';
import styles from './game.module.css';

interface DroppableSquareProps {
    gameControl: GameControl, 
    pos: BoardPosition,
};

function DroppableSquare({ gameControl, pos} : DroppableSquareProps )
{
    const [, drop] = useDrop({
        accept: itemTypes.PIECE,
 
        // The use of 'any' below is a kludge.  I am not sure how to type if 
        // properly, or even if proper typing is possible.
        drop: (dragParam: any /* KLUDGE */) => 
        {
            const pieceID : number = dragParam.id;

            if(gameControl.moveable(pieceID)) {
                gameControl.movePiece(pieceID, pos);
            } else {
                gameControl.copyPiece(pieceID, pos);
            }
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })


    const squareProperties = gameControl.squareProperties(pos);
    let squareClass = nonNull(styles.square);

    const { checkered, black } = squareProperties;
    if (!checkered) {
        squareClass += " " + nonNull(styles.plainSquare);
    } else if (black) {
        squareClass += " " + nonNull(styles.blackSquare);
    } else {
        squareClass += " " + nonNull(styles.whiteSquare);
    }

    const corePiece = gameControl.corePiece(pos);
    return (
        <div ref={drop} className={squareClass}
            onClick={()=>gameControl.squareClicked(pos)}
        >
            {corePiece ? <Piece corePiece={corePiece} gameControl={gameControl} /> : null}
        </div>

    );
}

export { DroppableSquare};