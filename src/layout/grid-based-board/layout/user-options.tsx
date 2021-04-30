import React from 'react';
import { GameControl } from '../control';
import styled from 'styled-components';

/* Options to control the game including redo, undo etc. */
const UserOptionsStyled = styled.div`
    margin-top: calc(var(--square-size) + 8px /* kludge */ );
    margin-left: 8px;
`;

/* A row of buttons */
const UserOptionsButtons = styled.div `
    margin-top: 6px;
`

const Button = styled.button`
   font-size: 20px;
   width: 3.7em;
   margin-right: 5px;
   padding-left: 0.1em;
   text-align:left;
   &last-of-type {
       margin-right: 0px;
    }
`;

function UserOptions({ gameControl }: { gameControl: GameControl; }) {

    return (
        <UserOptionsStyled>

            <UserOptionsButtons>
                <Button type='button' onClick={() => gameControl.restart()}>
                    Restart
                </Button>
            </UserOptionsButtons>

            <UserOptionsButtons>
                <Button type='button' 
                    disabled={!gameControl.canUndo} 
                    onClick={() => gameControl.undo()}
                >
                    Undo
                </Button>

                <Button type='button'
                    disabled={!gameControl.canRedo} 
                    onClick={() => gameControl.redo()}
                >
                    Redo
                </Button>
            </UserOptionsButtons>

            <UserOptionsButtons>
                <Button type='button' onClick={() => gameControl.flipRowOrder()}>
                    Flip
                </Button>
            </UserOptionsButtons>
            
        </UserOptionsStyled>
    );
}

export default UserOptions;