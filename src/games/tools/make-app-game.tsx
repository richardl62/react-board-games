import React from 'react'; // KLUDGE
import { BoardProps as BgioBoardProps } from 'boardgame.io/react';
import { GameDefinition, GameControl, useGameControlProps, moves } from './control'
import SimpleGame from './layout';
import { AppGame } from '../../shared/types';
import { BoardAndPlayers } from '../../boards';


interface AppFriendlyGameProps {
    gameDefinition: GameDefinition;
    bgioProps: BgioBoardProps;
}
function GameWrapper({bgioProps, gameDefinition} : AppFriendlyGameProps) {
    const gameControlProps = useGameControlProps(gameDefinition);
    const gameControl = new GameControl(bgioProps, gameControlProps);
        
    return (<SimpleGame gameControl={gameControl} />);
}

function makeAppGame(gameDefintion: GameDefinition) : AppGame {
    return {
        // 'displayName' rather than 'name' to avoid confusion with BGIO names, which
        // must be space free.
        displayName: gameDefintion.displayName,

        name: gameDefintion.name,

        minPlayers: gameDefintion.minPlayers,
        maxPlayers: gameDefintion.maxPlayers,


        setup: gameDefintion.setup,

        moves: moves,
        
        board: (bgioProps: BgioBoardProps) => (
            <BoardAndPlayers {...bgioProps} >
                <GameWrapper bgioProps={bgioProps} gameDefinition={gameDefintion} />
            </BoardAndPlayers>),
    }
}

export default makeAppGame;