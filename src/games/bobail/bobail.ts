import { makeAppGridGame } from '../../layout/grid-based-board';
import { bobailInput } from './bobail-input';
import bobailPiece from './bobail-piece';

const games = bobailInput.map(input => {
  const boardStyle = {
      checkered: false,
      labels: false,
  };

  return makeAppGridGame(input, boardStyle, bobailPiece);
});

export default games;