import { Position } from './game-control';
import { GameDefinition, SharedGameState } from './internal-interfaces';

// Provide the 'game' object required for a boardgame.io client.
function bgioGame(gameDefinition: GameDefinition) {
    const moves = {
        clearAll(g: SharedGameState, ctx: any) {
            g.forEach(row => row.fill(null));
        },
        move(g: SharedGameState, ctx: any, from: Position, to: Position) {
            g[to.row][to.col] = g[from.row][from.col];
            g[from.row][from.col] = null;
        },
        copy(g: SharedGameState, ctx: any, from: Position, to: Position) {
            g[to.row][to.col] = g[from.row][from.col];
        },
        clear(g: SharedGameState, ctx: any, pos: Position) {
            g[pos.row][pos.col] = null;
        }
    };

    return {
        name: gameDefinition.name.replace(/\s/g, ''),
        setup: () => gameDefinition.pieces,
        moves: moves,
    };
}

export default bgioGame;