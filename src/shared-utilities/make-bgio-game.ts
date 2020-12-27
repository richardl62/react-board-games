import { GameDefinition, SharedGameState, BoardPosition } from '../interfaces';

// Provide the 'game' object required for a boardgame.io client.
function makeBgioGame(gameDefinition: GameDefinition) {
    const moves = {
        clearAll(g: SharedGameState, ctx: any) {
            g.pieces.forEach(row => row.fill(null));
        },
        move(g: SharedGameState, ctx: any, from: BoardPosition, to: BoardPosition) {
            g.pieces[to.row][to.col] = g.pieces[from.row][from.col];
            g.pieces[from.row][from.col] = null;
        },
        copy(g: SharedGameState, ctx: any, from: BoardPosition, to: BoardPosition) {
            g.pieces[to.row][to.col] = g.pieces[from.row][from.col];
        },
        clear(g: SharedGameState, ctx: any, pos: BoardPosition) {
            g.pieces[pos.row][pos.col] = null;
        }
    };

    return {
        name: gameDefinition.name.replace(/\s/g, ''),
        setup: () => gameDefinition,
        moves: moves,
    };
}

export default makeBgioGame;