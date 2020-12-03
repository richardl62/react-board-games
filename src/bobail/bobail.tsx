import BoardGame from '../simple-board-game';
import { Counter } from '../pieces';

interface StringMap { [key: string]: string; }

const colors : StringMap = {
    p1: 'red',
    p2: 'green',
    bb: '#e0e000',
};

function makePiece(name: string) {

    const color = colors[name];

    if(!color) {
        throw new Error(`Unrecognised name for Bobail Piece: '${name}'`)
    }
 
    return <Counter color={color}/>;
}

function Bobail() {

    const options = {
        borderLabels: true,
        
        pieces: [
            ['p1', 'p1', 'p1', 'p1', 'p1'],
            [null, null, null, null, null],
            [null, null, 'bb', null, null],
            [null, null, null, null, null],
            ['p2', 'p2', 'p2', 'p2', 'p2'],
        ],

        makePiece: makePiece,
    };
  
    return <BoardGame options={options} />
  }

  export default Bobail;