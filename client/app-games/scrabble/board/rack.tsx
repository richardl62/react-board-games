import { makeExtendedLetter } from '@game-control/games/scrabble/config/extended-letter';
import { SquareType } from '@game-control/games/scrabble/config/square-type';
import { sAssert } from '@utils/assert';
import { BoarderedGrid } from '@utils/board/boardered-grid';
import { JSX } from 'react';
import { SquareID, boardIDs } from '../client-side/game-actions';
import { useScrabbleState } from '../client-side/scrabble-state';
import { BoardSquare } from './board-square';
import { boardBoarderColor, boardBoarderSize } from './style';
import { Tile } from './tile';

interface RackProps {
  selected: boolean[] | null;
  setSelected: (arg: boolean[]) => void;
}

export function Rack(props: RackProps): JSX.Element {
  const { selected, setSelected } = props;
  const context = useScrabbleState();

  const coreTiles = context.rack;

  const onDragEnd = ({ drag, drop }: { drag: SquareID; drop: SquareID | null }) => {
    if (drop) {
      context.dispatch({
        type: 'move',
        data: { from: drag, to: drop },
      });
    }
  };

  const toggleSelect = (index: number) => {
    sAssert(selected);
    const newSwappable = [...selected];
    newSwappable[index] = !newSwappable[index];
    setSelected(newSwappable);
  };

  const elems = coreTiles.map((tile, index) => {
    const content = tile && <Tile tile={makeExtendedLetter(tile)} />;

    let onClick;
    if (selected) {
      onClick = () => toggleSelect(index);
    } else if (context.clickMoveStart && context.rack[index]) {
      onClick = () =>
        context.dispatch({
          type: 'clickMove',
          data: { rackPos: index },
        });
    }

    return (
      <BoardSquare
        key={index}
        content={content}
        squareType={SquareType.simple}
        squareID={{ row: 0, col: index, boardID: boardIDs.rack }}
        draggable={true}
        onDragEnd={selected ? undefined : onDragEnd}
        onClick={onClick}
        highlight={Boolean(selected?.[index])}
        showHover={false}
      />
    );
  });

  return (
    <BoarderedGrid
      nCols={coreTiles.length}
      backgroundColor={boardBoarderColor}
      gridGap={boardBoarderSize.internal}
      borderWidth={boardBoarderSize.external}
    >
      {elems}
    </BoarderedGrid>
  );
}
