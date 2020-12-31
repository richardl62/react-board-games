import { GameDefinition, SharedGameState, BoardPosition, PieceType } from '../interfaces';

// Provide the 'game' object required for a boardgame.io client.
function makeBgioGame(gameDefinition: GameDefinition) {
    const moves = {
        clearAll(g: SharedGameState, ctx: any) {
            g.pieces.forEach(row => row.fill(null));
        },
        add(g: SharedGameState, ctx: any, type: PieceType, to: BoardPosition) {
            g.pieces[to.row][to.col] = type;
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