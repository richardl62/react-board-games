import { Lobby } from 'boardgame.io/react';
import gameDefinitions from './game-definition';
import  { makeGame } from './bgio'
interface Props {
    server: string;
}


function RenderGame(props: any) {
    console.log("RenderGame props", props);
    return (<p>Hello from RenderGame</p>);
}
const gameComponents = gameDefinitions.map(gameDef=> {
    return {
        game: makeGame(gameDef),
        board: RenderGame,
    }
    })
function GameLobby({server} : Props) {
    return (
        <>
        <Lobby
            gameServer={server}
            lobbyServer={server}
            gameComponents={gameComponents}
         />
        <h2> When I work i'll be a lobby </h2>
        <p>I'll run on {server} </p>
        </>
    );
}

export default GameLobby;