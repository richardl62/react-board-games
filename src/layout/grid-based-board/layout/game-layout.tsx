import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GameControl } from '../control';
import Board from './board';
import styled from 'styled-components';
import RowOfPieces from './row-of-pieces';
import UserOptions from './user-options';

/* The 'game proper'.  Everything that is not in userOptions */
const GameStyled = styled.div`
    display: flex;
    box-sizing: border-box;
    padding: 0;
`
const PlayingArea = styled.div`
    --square-size: 50px;

    --board-background: rgb(100,0,0); /* Dark brown*/
    --board-black-square: rgb(165 42 42); /* brown */
    --board-white-square:  rgb(255 248 220); /* cornsilk */
    --active-square-highlight: rgb(200 200 100); /* dark yellow */
`

const Message = styled.div`
    font-size: large;
`

function Header({ gameControl }: { gameControl: GameControl }) {
    const {playerNames, caller } = gameControl.players;
    const nPlayers = playerNames.length;
    let message;
    if( gameControl.gameover ) {
        message = 'Game over';
        if(nPlayers > 1) {
            const winner = gameControl.gameover.winner;
            const name = (winner === caller) ? "You" : playerNames[winner];
            message += `: ${name} won`;
        }
    } else if(gameControl.moveDescription) {
        message = gameControl.moveDescription;
    }
    return (<Message>{message}</Message>);
}

function Game({ gameControl }: { gameControl: GameControl }) {
    return (
        <DndProvider backend={HTML5Backend}>
            <GameStyled>
                <PlayingArea>
                    <Header gameControl={gameControl} />
                    <div>
                        <RowOfPieces where='top' gameControl={gameControl} />

                        <Board gameControl={gameControl} />

                        <RowOfPieces where='bottom' gameControl={gameControl} />
                    </div>
                </PlayingArea>
                <UserOptions gameControl={gameControl} />
            </GameStyled>
        </DndProvider>
    );
}

export default Game;
