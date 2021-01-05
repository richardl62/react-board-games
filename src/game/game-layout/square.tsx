import React from 'react';
import { useDrop } from 'react-dnd';
import { itemTypes } from '../full-game/constants';
import Piece from '../full-game/controlled-piece';
import GameControl from '../game-control';
import { BoardPosition, SquareProperties } from '../../interfaces';

interface SimpleSquareProps {
    squareProperties?: SquareProperties;
}

class SimpleSquare extends React.PureComponent<SimpleSquareProps> {
    render() {
        const {squareProperties, children} = this.props;

        let squareClass = 'sbg__square';
        let placeholderClass = 'sbg__square-placeholder';

        if (squareProperties) {
            const { checkered, black, movingFrom, canMoveTo } = squareProperties;
            if (!checkered) {
                squareClass += ' sbg__simple-square';
            } else if (black) {
                squareClass += ' sbg__black-square';
            } else {
                squareClass += ' sbg__white-square';
            } 

            if(movingFrom) {
                placeholderClass += ' sbg__move-from';
            } else if (canMoveTo) {
                placeholderClass += ' sbg__can-move-to';
            }

        }
    
        return (
            <div className={placeholderClass} >
                <div className={squareClass}>
                    {children}
                </div>
           </div>
        );
    }
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

    const corePiece = gameControl.corePiece(pos);
    return (
        <div ref={drop}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
            onClick={()=>gameControl.squareClicked(pos)}
        >
            <SimpleSquare squareProperties={gameControl.squareProperties(pos)}>
                {corePiece ? <Piece corePiece={corePiece} gameControl={gameControl} /> : null}
            </SimpleSquare>

        </div>

    );
}

export {SimpleSquare, DroppableSquare};