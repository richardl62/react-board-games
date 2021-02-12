import { G, ClientMoves, Position } from './moves';
import { BoardProps } from 'boardgame.io/react';

type BoardPropsG = BoardProps<G>; 

export type { G, ClientMoves, BoardPropsG as BoardProps, Position} 

export {default as Lobby} from './bgio-lobby';
export {default as gamesWithClient} from './games-with-client';



