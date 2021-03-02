import React from 'react'; // KLUDGE
import { BoardProps as BgioBoardProps } from 'boardgame.io/react';
import { GameDefinition, GameControl, useGameControlProps, moves } from './control'
import SimpleGame from './layout';

interface AppFriendlyGameProps {
    gameDefinition: GameDefinition;
    bgioProps: BgioBoardProps;
}
function GameWrapper({bgioProps, gameDefinition} : AppFriendlyGameProps) {
    const gameControlProps = useGameControlProps(gameDefinition);
    const gameControl = new GameControl(bgioProps, gameControlProps);
        
    return (<SimpleGame gameControl={gameControl} />);
}

function appFriendlyGame(gameDefintion: GameDefinition) {
    return {
        // 'displayName' rather than 'name' to avoid confusion with BGIO names, which
        // must be space free.
        displayName: gameDefintion.name,

        // Space-free name suitable for use with BGIO. (Is this better set here or
        // in the App?)
        name: gameDefintion.name.replace(/[^\w]/g, '').toLowerCase(),

        setup: () => gameDefintion.initialState,
        moves: moves,
        renderGame: (bgioProps: BgioBoardProps) => (
            <GameWrapper bgioProps={bgioProps} gameDefinition={gameDefintion} />
        ),
    }
}

export default appFriendlyGame;