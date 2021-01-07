import React from 'react';
import { useDrop } from 'react-dnd';
import { itemTypes } from '../full-game/constants';
import Piece from '../full-game/controlled-piece';
import GameControl from '../game-control';
import { BoardPosition } from '../../interfaces';

import { nonNull } from './../../tools';
import styles from './game.module.css';


interface SimpleSquareProps {
    checkered: boolean;
    black: boolean;
    children: React.ReactNode;
};

function SimpleSquare({checkered, black, children} : SimpleSquareProps) {
    let className = nonNull(styles.square);

    if (!checkered) {
        className += " " + nonNull(styles.plainSquare);
    } else if (black) {
        className += " " + nonNull(styles.blackSquare);
    } else {
        className += " " + nonNull(styles.whiteSquare);
    }

    return <div className={className}> {children} </div>;
}

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


    const corePiece = gameControl.corePiece(pos);
    return (

        <SimpleSquare
            black={squareProperties.black}
            checkered={squareProperties.checkered}
        >
            {/* pieceContainer sets z-index to 'lift' the piece and so prevents 
                the background being dragged. */}
            <div
                className={nonNull(styles.pieceContainer)}
                onClick={() => gameControl.squareClicked(pos)}
                ref={drop}
            >
                {corePiece ? <Piece corePiece={corePiece} gameControl={gameControl} /> : null}
            </div>
        </SimpleSquare>
    )
}

export { DroppableSquare};