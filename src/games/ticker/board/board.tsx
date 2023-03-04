import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTicker } from "../../../utils/use-countdown";
import { useGameContext } from "../client-side/game-context";

const defaultServerLag = 10;

const Count = styled.div`
    margin: 20px;
    margin: 20px;

    p, h1 {
        font-family: helvetica;
        font-size: 40px;
    }

    label, input {
        font-size: 30px;
    }

    input {
        margin-left: 0.5em;
        width: 4em;
    }

`;

function hoursMinSeconds(totalSecond: number) {
    
    function div60(num: number) {
        const nearestInt = Math.floor(num + 0.5);
   
        const rem = nearestInt % 60;
        const div = Math.floor((nearestInt - rem) / 60);

        return [rem, div];
    }

    function twoDigits(num: number) {
        return ((num < 10 ) ? "0" : "") + num;
    }

    const [secs, totalMinutes] = div60(totalSecond);
    const [mins, hours] = div60(totalMinutes);

    return `${hours}:${twoDigits(mins)}:${twoDigits(secs)}`; 
}


function BoardCurrentPlayer() : JSX.Element {
    const {G: {count: serverCount}, moves
    } = useGameContext();

    const {count: localCount} = useTicker();
    const [serverLag, setServerLag] = useState(defaultServerLag);

    useEffect(()=>{
        if(serverCount < localCount - serverLag) {
            moves.setCount(localCount);
        }   
    },[serverCount, localCount, serverLag]);

    const onChangeServerLag = (value: string) => {
        setServerLag(parseInt(value));
    };

    return <Count>
        <p>Reported time since start</p>
        <p>{`Local: ${hoursMinSeconds(localCount)}`}</p>
        <p>{`Server: ${hoursMinSeconds(serverCount)}`}</p>
        <label>
            Max server lag:
            <input 
                type="number" 
                value={serverLag} 
                min={0}
                step={1}
                onChange={(event) => onChangeServerLag(event.target.value)}
            />
        </label>
    </Count>; 
}

function BoardNonCurrentPlayer() : JSX.Element {
    const {G: {count: serverCount}} = useGameContext();

    return <Count>
        <p>Reported time since start</p>
        <p>{`Server: ${hoursMinSeconds(serverCount)}`}</p>
    </Count>; 
}

function Board() : JSX.Element {
    const {playerID, ctx: {currentPlayer}} = useGameContext();

    if (playerID === currentPlayer) {
        return <BoardCurrentPlayer/>;
    } else {
        return <BoardNonCurrentPlayer/>;
    }
}

export default Board;

