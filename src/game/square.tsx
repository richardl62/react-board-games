import React from 'react';
import { useDrop } from 'react-dnd';
import { itemTypes } from '../simple-board-game/constants';
import { Piece } from '../simple-board-game/controlled-piece';
import { CorePiece } from '../simple-board-game/core-piece';
import { GameControl } from '../simple-board-game/game-control';

interface SquareStyle {
    checkered: boolean,
    black: boolean,
}

interface SimpleSquareProps {
    squareStyle?: SquareStyle;
}

class SimpleSquare extends React.PureComponent<SimpleSquareProps> {
    render() {
        const {children, squareStyle} = this.props;
        
        let className = 'sbg__square';
        if (squareStyle) {
            const { checkered, black } = squareStyle;
            if (!checkered) {
                className += ' sbg__simple-square';
            } else if (black) {
                className += ' sbg__black-square';
            } else {
                className += ' sbg__white-square';
            } 
        }
    
        return (
            <div className='sbg__square-placeholder'>
                <div className={className}>
                    {children}
                </div>
           </div>
        );
    }
}

function DroppableSquare(options:
    {
        corePiece: CorePiece | null,
        gameControl: GameControl, 
        squareStyle: SquareStyle,
        row: number,
        col: number,
    }) {

    const { corePiece, gameControl, squareStyle, row, col} = options;

    const [, drop] = useDrop({
        accept: itemTypes.PIECE,
 
        // The use of 'any' below is a kludge.  I am not sure how to type if properly, or
        // even if proper typing is possible.
        drop: (corePiece: any /*KLUDGE - see above */) => 
        {
            // Quick and dirty test that 'corePiece' is a corePiece    
            if(corePiece.id && corePiece.name)
            {
                throw new Error(`Object to drop is not a CorePiece`);
            }

            gameControl.movePiece(corePiece as CorePiece, {row: row, col: col});
        },
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })
    return (
        <div ref={drop}
            style={{
                position: 'relative',
                width: '100%',
                height: '100%',
            }}
        >
            <SimpleSquare squareStyle={squareStyle}>
                {corePiece ? <Piece corePiece={corePiece} gameControl={gameControl} /> : null}
            </SimpleSquare>

        </div>

    );
}

export {SimpleSquare, DroppableSquare};