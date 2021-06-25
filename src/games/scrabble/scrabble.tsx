import { useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Board, ClickDragState, makeBoardProps, makeSquareInteraction, MoveFunctions, SquareID } from "../../boards";
import { DragType, SquareInteraction } from "../../boards/internal/square";
import { nestedArrayMap } from "../../shared/tools";
import { AppGame, Bgio } from "../../shared/types";
import { Tile } from "./tile";

type Letter = string;

type G = {
    board: (Letter|null)[][],
    ranks: (Letter|null)[][],
    moveStart: SquareID | null,
}

interface BoardProps {
    squareInteraction: SquareInteraction;
    clickDragState: ClickDragState;
    letters: (Letter|null)[][];
  }

function MainBoard({letters, squareInteraction, clickDragState}: BoardProps) {
    const tiles = nestedArrayMap(letters, letter =>
        letter && <Tile letter={letter} />
      );
    
      const boardProps = makeBoardProps(
        tiles, 
        'plain',
        'mainBoard',
        squareInteraction, 
        clickDragState.start
      );
  
    
      return <Board {...boardProps} />
}


interface RackProps {
    squareInteraction: SquareInteraction;
    clickDragState: ClickDragState;
    letters: (Letter|null)[];
}

function Rack(props: RackProps) {
    return <div>Rack</div>
}

function Scrabble(props: Bgio.BoardProps<G>) {
    const { G } = props;
  
    const clickDragState = useRef(new ClickDragState()).current;
    const moveFunctions: MoveFunctions = {
      onClick: (sq: SquareID) => {
        console.log('onClick', JSON.stringify(sq));
      },
  
      onMoveStart: (sq: SquareID) => {
        console.log('onMoveStart', JSON.stringify(sq));
        return true;
      },
  
      onMoveEnd: (sq: SquareID) => {
        console.log('onMoveEnd', JSON.stringify(sq));
      }
    };
  
    const basicSquareInteraction = makeSquareInteraction(moveFunctions, clickDragState);
    const offBoardSquareInteraction = { ...basicSquareInteraction, dragType: () => DragType.copy };
    return (
        <DndProvider backend={HTML5Backend}>
          <Rack
            squareInteraction={offBoardSquareInteraction}
            clickDragState={clickDragState}
            letters={G.ranks[0] /*KLUDGE*/} 
          />
          <MainBoard
            squareInteraction={offBoardSquareInteraction}
            clickDragState={clickDragState}
            letters={G.board} 
          />
       
      </DndProvider>
    )
  }
  

export const scrabble: AppGame = {

    name: 'scrabble',
    displayName: 'Scrabble',

    minPlayers: 1,
    maxPlayers: 1, //TEMPORARY
    setup: (): G => {
        return {
            board: [
                ['a', 'b', 'c'],
                [null,null,null],
                ['x', 'y', 'z'],
            ],
            ranks:[
                ['l', 'm', 'n'],
            ],
            moveStart: null,
        }
    },

    moves: {

    },

    board: Scrabble,
};
