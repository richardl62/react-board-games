import React from 'react'; // KLUDGE
import { GameDefinition, AppFriendlyGame } from './game-definition';

function appFriendlyGame(gameDefintion: GameDefinition) : AppFriendlyGame {
    return {
        name: gameDefintion.name,
        setup: () => gameDefintion.initialState,
        moves: [], // KLUDGE
        renderGame: (arg0: any) => (<div>I'm a game</div>), //KLUDGE
    }
}

export default appFriendlyGame;