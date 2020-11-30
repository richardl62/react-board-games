import React from 'react';
import { useDrop } from 'react-dnd';
import { itemTypes } from './constants';
import { Piece } from './piece';
import { CorePiece } from './core-piece';
import { BoardControl } from './board-control';

interface Props {
    color?: 'black' | 'white';
}

class SimpleSquare extends React.PureComponent<Props> {
    render() {
        const color = this.props.color;
        const children = this.props.children;

        let className = 'square';
        if (color) {
            if(color === 'black') {
                className += ' black-square';
            } else if(color === 'white') {
                className += ' white-square';
            } else {
                throw new Error(`Unrecognised square color: ${color}`)
            }
        }
        
        return (
            <div className='square-placeholder'>
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
        boardControl: BoardControl, 
        color: 'black' | 'white',
        row: number,
        col: number,
    }) {

    const { corePiece, boardControl, color, row, col} = options;

    const [, drop] = useDrop({
        accept: itemTypes.PIECE,
 
        // The use of 'any' below is a kludge.  I am not sure how to type if properly, or
        // even if proper typing is possible.
        drop: (corePiece: any) => boardControl.movePiece(corePiece.id, row, col),
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
            <SimpleSquare color={color}>
                {corePiece ? <Piece corePiece={corePiece} boardControl={boardControl} /> : null}
            </SimpleSquare>

        </div>

    );
}

export {SimpleSquare, DroppableSquare};