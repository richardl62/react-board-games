import { G, ClientMoves } from './moves';
import { BoardProps } from 'boardgame.io/react';

type BoardPropsG = BoardProps<G>; 

export type { G, ClientMoves, BoardPropsG as BoardProps} 

export {default as Lobby} from './bgio-lobby';
export {default as makeClient} from './make-client';



