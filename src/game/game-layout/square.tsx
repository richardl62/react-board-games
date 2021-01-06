import React from 'react';
import { useDrop } from 'react-dnd';
import { itemTypes } from '../full-game/constants';
import Piece from '../full-game/controlled-piece';
import GameControl from '../game-control';
import { BoardPosition } from '../../interfaces';

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
            console.log(pieceID);

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
    let squareClass = 'sbg__square';

    const { checkered, black } = squareProperties;
    if (!checkered) {
        squareClass += 'sbg__plain-square';
    } else if (black) {
        squareClass += ' sbg__black-square';
    } else {
        squareClass += ' sbg__white-square';
    }

    const corePiece = gameControl.corePiece(pos);
    return (
        <div ref={drop} className={squareClass}
            onClick={()=>gameControl.squareClicked(pos)}
        >
            <div className="sbg__square_highlighter"/>
            {corePiece ? <Piece corePiece={corePiece} gameControl={gameControl} /> : null}
        </div>

    );
}

export { DroppableSquare};