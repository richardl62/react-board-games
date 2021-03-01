import { ClientMoves } from './moves';
import { GameState } from "./game-state";
import { BoardProps } from 'boardgame.io/react';

type BoardPropsG = BoardProps<GameState>; 

export type { GameState, ClientMoves, BoardPropsG as BoardProps } 

export {default as moves} from './moves';
export {default as Lobby} from './bgio-lobby';
export {default as gamesWithClient} from './games-with-client';



